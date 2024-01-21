create extension if not exists "wrappers" with schema "extensions";


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_customer_id(p_id text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_customer_id text;
BEGIN
    BEGIN
        -- Try to retrieve the id from the stripe.customers table
        SELECT id
        INTO v_customer_id
        FROM stripe.customers
        WHERE id = p_id;

    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            -- Handle the case when no user is found
            v_customer_id := NULL;
    END;

    RETURN v_customer_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.list_stripe_prices()
 RETURNS TABLE(id text, currency text, unit_amount bigint, type text, lookup_key text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        p.id AS id,
        p.currency AS currency,
        p.unit_amount AS unit_amount,
        p.type AS type,
        p.attrs->'lookup_key'->>0 AS lookup_key
    FROM
        stripe.prices p;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.list_stripe_products()
 RETURNS TABLE(id text, name text, description text, price_id text, image_url text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        p.id AS id,
        p.name AS name,
        p.attrs->>'description' AS description,
        p.default_price AS price_id,
        p.attrs->'images'->>0 AS image_url
    FROM
        stripe.products p
    WHERE
        p.active = true;
END;
$function$
;


create schema if not exists "stripe";


