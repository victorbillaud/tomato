drop policy "Enable delete for users based on user_id" on "public"."conversation";

drop policy "Enable insert with item_id for item owner only" on "public"."conversation";

drop policy "Enable update for owner id" on "public"."conversation";

drop policy "Enable select for owner only" on "public"."item";

drop policy "Enable insert for everyone" on "public"."message";

drop policy "Enable read access for member of the conversation" on "public"."message";

alter table "public"."conversation" add column "token" character varying;

alter table "public"."message" alter column "sender_id" set default auth.uid();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.before_insert_conversation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Generate a token for the new conversation
    NEW.token := generate_conversation_token(NEW.id);
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_conversation_token(conversation_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    secret_key TEXT;
    token TEXT;
BEGIN
    -- Retrieve the secret key from the vault
    SELECT decrypted_secret INTO secret_key FROM vault.decrypted_secrets where name = 'tomato-jwt-token';

    -- Generate the JWT token
    token := extensions.sign(
        json_build_object('conversation_id', conversation_id::text),
        secret_key,
        'HS256'
    );

    RETURN token;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_conversation_id_from_token(token text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    secret_key TEXT;
    decoded JSON;
BEGIN
    -- Retrieve the secret key from the vault
    SELECT decrypted_secret INTO secret_key FROM vault.decrypted_secrets where name = 'tomato-jwt-token';

    -- Decode the JWT token
    BEGIN
        SELECT (extensions.verify(token, secret_key)).payload INTO decoded;
    EXCEPTION WHEN OTHERS THEN
        -- In case of any decoding error, return NULL
        RETURN NULL;
    END;

    -- Extract and return the conversation_id from the token payload
    RETURN (decoded ->> 'conversation_id')::UUID;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_conversations_and_messages(tokens text[], user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    conv_id UUID;
    token text; -- Declare the loop variable
BEGIN
    -- Loop through each token
    FOREACH token IN ARRAY tokens LOOP
        -- Decode the token to get the conversation_id
        conv_id := public.get_conversation_id_from_token(token);

        RAISE LOG '%', conv_id;

        IF conv_id IS NOT NULL THEN
            -- Update the finder_id in the conversation table
            UPDATE public.conversation
            SET finder_id = user_id
            WHERE conversation.id = conv_id;

            -- Update the sender_id in the message table for messages in this conversation
            -- where sender_id is NULL (messages sent by the anonymous user)
            UPDATE public.message
            SET sender_id = user_id
            WHERE message.conversation_id = conv_id AND message.sender_id IS NULL;
        END IF;
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.verify_conversation_token(expected_conversation_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    tokens TEXT[];
    token TEXT;
    secret_key TEXT;
    decoded JSON;
    is_valid BOOLEAN;
BEGIN
    -- Extract the conversation-tokens from the request headers
    tokens := string_to_array(current_setting('request.headers', true)::json->>'conversation-tokens', ',');

    -- Check if tokens are null or empty
    IF tokens IS NULL OR array_length(tokens, 1) IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Get the secret key from the vault
    SELECT decrypted_secret INTO secret_key FROM vault.decrypted_secrets WHERE name = 'tomato-jwt-token';

    -- Initialize as not valid
    is_valid := FALSE;

    -- Iterate through the tokens
    FOREACH token IN ARRAY tokens LOOP
        -- Verify the JWT token and get the payload
        BEGIN
            SELECT (extensions.verify(token, secret_key)).payload INTO decoded;
            -- Check if the token is valid and if the conversation_id in the token matches the expected value
            IF decoded IS NOT NULL AND (decoded ->> 'conversation_id')::UUID = expected_conversation_id THEN
                is_valid := TRUE;
                EXIT; -- Exit the loop as we found a valid token
            END IF;
        EXCEPTION WHEN OTHERS THEN
            -- In case of any decoding error, continue to the next token
            CONTINUE;
        END;
    END LOOP;

    RETURN is_valid;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.verify_item_token(expected_item_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    tokens TEXT[];
    token TEXT;
    secret_key TEXT;
    decoded JSON;
    conversation_id UUID;
    is_valid BOOLEAN;
BEGIN
    -- Extract the conversation-tokens from the request headers
    tokens := string_to_array(current_setting('request.headers', true)::json->>'conversation-tokens', ',');

    -- Check if tokens are null or empty
    IF tokens IS NULL OR array_length(tokens, 1) IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Get the secret key from the vault
    SELECT decrypted_secret INTO secret_key FROM vault.decrypted_secrets WHERE name = 'tomato-jwt-token';

    -- Initialize as not valid
    is_valid := FALSE;

    -- Iterate through the tokens
    FOREACH token IN ARRAY tokens LOOP
        -- Verify the JWT token and get the payload
        BEGIN
            SELECT (extensions.verify(token, secret_key)).payload INTO decoded;
            -- Extract the conversation_id from the token
            conversation_id := (decoded ->> 'conversation_id')::UUID;
            
            -- Check if the token is valid and if the item_id of the conversation matches the expected value
            IF conversation_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM public.conversation 
                WHERE id = conversation_id AND item_id = expected_item_id
            ) THEN
                is_valid := TRUE;
                EXIT; -- Exit the loop as we found a valid token
            END IF;
        EXCEPTION WHEN OTHERS THEN
            -- In case of any decoding error, continue to the next token
            CONTINUE;
        END;
    END LOOP;

    RETURN is_valid;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_conversations_with_last_message(user_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(id uuid, created_at timestamp with time zone, updated_at timestamp with time zone, item_id uuid, owner_id uuid, finder_id uuid, last_message jsonb)
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
    conversation_ids uuid[];
    tokens text[];
    token text;
BEGIN
    -- Extract the conversation-tokens from the request headers and split them into an array
    -- If user_id is provided, ignore the tokens
    IF user_id IS NULL THEN
        tokens := string_to_array(current_setting('request.headers', true)::json->>'conversation-tokens', ',');

        -- Populate conversation_ids array from tokens
        FOREACH token IN ARRAY tokens LOOP
            conversation_ids := array_append(conversation_ids, public.get_conversation_id_from_token(token));
        END LOOP;
    END IF;

    RETURN QUERY
    SELECT
        c.id,
        c.created_at,
        c.updated_at,
        c.item_id,
        c.owner_id,
        c.finder_id,
        (
            SELECT jsonb_build_object('content', m.content, 'created_at', m.created_at, 'sender_id', m.sender_id)
            FROM message m
            WHERE m.conversation_id = c.id
            ORDER BY m.created_at DESC
            LIMIT 1
        ) AS last_message
    FROM
        conversation c
    WHERE
        (user_id IS NOT NULL AND (c.owner_id = user_id OR c.finder_id = user_id)) OR
        (user_id IS NULL AND c.id = ANY(conversation_ids))
    ORDER BY last_message->>'created_at' DESC;
END;
$function$
;

create policy "Enable insert for authenticated users only"
on "public"."conversation"
as permissive
for insert
to service_role
with check (true);


create policy "select_conversation_policy"
on "public"."conversation"
as permissive
for select
to anon
using (verify_conversation_token(id));


create policy "item_select_auth_policy"
on "public"."item"
as permissive
for select
to authenticated
using (((auth.uid() = user_id) OR (EXISTS ( SELECT 1
   FROM conversation c
  WHERE ((c.item_id = item.id) AND (c.finder_id = auth.uid()))))));


create policy "select_item_policy"
on "public"."item"
as permissive
for select
to anon
using (verify_item_token(id));


create policy "authenticated_message_policy"
on "public"."message"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM conversation c
  WHERE ((c.id = message.conversation_id) AND ((c.owner_id = auth.uid()) OR (c.finder_id = auth.uid()))))))
with check ((EXISTS ( SELECT 1
   FROM conversation c
  WHERE ((c.id = message.conversation_id) AND ((c.owner_id = auth.uid()) OR (c.finder_id = auth.uid()))))));


create policy "insert_message_policy"
on "public"."message"
as permissive
for insert
to anon
with check (verify_conversation_token(conversation_id));


create policy "select_message_policy"
on "public"."message"
as permissive
for select
to anon
using (verify_conversation_token(conversation_id));


CREATE TRIGGER trigger_generate_conversation_token BEFORE INSERT ON public.conversation FOR EACH ROW EXECUTE FUNCTION before_insert_conversation();


