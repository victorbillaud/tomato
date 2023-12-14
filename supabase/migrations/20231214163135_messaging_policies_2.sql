
set check_function_bodies = off;

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



