
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

CREATE OR REPLACE FUNCTION public.message_insert_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Verify the conversation token with the conversation_id of the new message
    IF NOT verify_conversation_token(NEW.conversation_id) THEN
        RAISE EXCEPTION 'Invalid conversation token';
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.verify_conversation_token(expected_conversation_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    token TEXT;
    secret_key TEXT;
    decoded JSON;
BEGIN
    -- Extract the conversation-token from the request headers
    token := current_setting('request.headers', true)::json->>'conversation-token';

    -- Get the secret key from the vault
    SELECT decrypted_secret INTO secret_key FROM vault.decrypted_secrets where name = 'tomato-jwt-token';

    -- Verify the JWT token and get the payload
    SELECT (extensions.verify(token, secret_key)).payload INTO decoded;
    
    -- Check if the token is valid and if the conversation_id in the token matches the expected value
    RETURN decoded IS NOT NULL AND (decoded ->> 'conversation_id')::UUID = expected_conversation_id;
END;
$function$
;

create policy "select_conversation_policy"
on "public"."conversation"
as permissive
for select
to public
using (verify_conversation_token(id));


create policy "select_message_policy"
on "public"."message"
as permissive
for select
to public
using (verify_conversation_token(conversation_id));


CREATE TRIGGER trigger_generate_conversation_token BEFORE INSERT ON public.conversation FOR EACH ROW EXECUTE FUNCTION before_insert_conversation();

CREATE TRIGGER before_insert_message BEFORE INSERT ON public.message FOR EACH ROW EXECUTE FUNCTION message_insert_trigger();


