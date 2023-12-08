drop policy "Enable insert for everyone" on "public"."message";

drop policy "Enable read access for member of the conversation" on "public"."message";

drop policy "Enable select for authenticated users only" on "public"."conversation";

alter table
    "public"."message"
alter column
    "sender_id"
set
    default auth.uid();

set
    check_function_bodies = off;

CREATE
OR REPLACE FUNCTION public.before_insert_conversation() RETURNS trigger LANGUAGE plpgsql AS $ function $ BEGIN -- Generate a token for the new conversation
NEW.token := generate_conversation_token(NEW.id);

RETURN NEW;

END;

$ function $;

CREATE
OR REPLACE FUNCTION public.generate_conversation_token(conversation_id uuid) RETURNS text LANGUAGE plpgsql SECURITY DEFINER AS $ function $ DECLARE secret_key TEXT;

token TEXT;

BEGIN -- Retrieve the secret key from the vault
SELECT
    decrypted_secret INTO secret_key
FROM
    vault.decrypted_secrets
where
    name = 'tomato-jwt-token';

-- Generate the JWT token
token := extensions.sign(
    json_build_object('conversation_id', conversation_id :: text),
    secret_key,
    'HS256'
);

RETURN token;

END;

$ function $;

CREATE
OR REPLACE FUNCTION public.get_conversation_id_from_token(token text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $ function $ DECLARE secret_key TEXT;

decoded JSON;

BEGIN -- Retrieve the secret key from the vault
SELECT
    decrypted_secret INTO secret_key
FROM
    vault.decrypted_secrets
where
    name = 'tomato-jwt-token';

-- Decode the JWT token
BEGIN
SELECT
    (extensions.verify(token, secret_key)).payload INTO decoded;

EXCEPTION
WHEN OTHERS THEN -- In case of any decoding error, return NULL
RETURN NULL;

END;

-- Extract and return the conversation_id from the token payload
RETURN (decoded ->> 'conversation_id') :: UUID;

END;

$ function $;

CREATE
OR REPLACE FUNCTION public.update_user_conversations_and_messages(tokens text [], user_id uuid) RETURNS void LANGUAGE plpgsql AS $ function $ DECLARE conv_id UUID;

token text;

-- Declare the loop variable
BEGIN -- Loop through each token
FOREACH token IN ARRAY tokens LOOP -- Decode the token to get the conversation_id
conv_id := public.get_conversation_id_from_token(token);

RAISE LOG '%',
conv_id;

IF conv_id IS NOT NULL THEN -- Update the finder_id in the conversation table
UPDATE
    public.conversation
SET
    finder_id = user_id
WHERE
    conversation.id = conv_id;

-- Update the sender_id in the message table for messages in this conversation
-- where sender_id is NULL (messages sent by the anonymous user)
UPDATE
    public.message
SET
    sender_id = user_id
WHERE
    message.conversation_id = conv_id
    AND message.sender_id IS NULL;

END IF;

END LOOP;

END;

$ function $;

CREATE
OR REPLACE FUNCTION public.verify_conversation_token(expected_conversation_id uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $ function $ DECLARE token TEXT;

secret_key TEXT;

decoded JSON;

BEGIN -- Extract the conversation-token from the request headers
token := current_setting('request.headers', true) :: json ->> 'conversation-token';

-- Get the secret key from the vault
SELECT
    decrypted_secret INTO secret_key
FROM
    vault.decrypted_secrets
where
    name = 'tomato-jwt-token';

-- Verify the JWT token and get the payload
SELECT
    (extensions.verify(token, secret_key)).payload INTO decoded;

-- Check if the token is valid and if the conversation_id in the token matches the expected value
RETURN decoded IS NOT NULL
AND (decoded ->> 'conversation_id') :: UUID = expected_conversation_id;

END;

$ function $;

create policy "select_conversation_policy" on "public"."conversation" as permissive for
select
    to anon using (verify_conversation_token(id));

create policy "authenticated_message_policy" on "public"."message" as permissive for all to authenticated using (
    (
        EXISTS (
            SELECT
                1
            FROM
                conversation c
            WHERE
                (
                    (c.id = message.conversation_id)
                    AND (
                        (c.owner_id = auth.uid())
                        OR (c.finder_id = auth.uid())
                    )
                )
        )
    )
) with check (
    (
        EXISTS (
            SELECT
                1
            FROM
                conversation c
            WHERE
                (
                    (c.id = message.conversation_id)
                    AND (
                        (c.owner_id = auth.uid())
                        OR (c.finder_id = auth.uid())
                    )
                )
        )
    )
);

create policy "insert_message_policy" on "public"."message" as permissive for
insert
    to anon with check (verify_conversation_token(conversation_id));

create policy "select_message_policy" on "public"."message" as permissive for
select
    to anon using (verify_conversation_token(conversation_id));

create policy "Enable select for authenticated users only" on "public"."conversation" as permissive for
select
    to authenticated using (
        (
            (auth.uid() = owner_id)
            OR (auth.uid() = finder_id)
        )
    );

CREATE TRIGGER trigger_generate_conversation_token BEFORE
INSERT
    ON public.conversation FOR EACH ROW EXECUTE FUNCTION before_insert_conversation();