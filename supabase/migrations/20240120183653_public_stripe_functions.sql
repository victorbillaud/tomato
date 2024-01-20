create extension if not exists "wrappers" with schema "extensions";


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.list_stripe_prices()
 RETURNS TABLE(id text, currency text, unit_amount bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        p.id AS id,
        p.currency AS currency,
        p.unit_amount AS unit_amount
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
        stripe.products p;
END;
$function$
;


create schema if not exists "stripe";


