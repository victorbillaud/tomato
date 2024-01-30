create extension if not exists "wrappers" with schema "extensions";

drop policy "Enable insert for authenticated users only" on "public"."qrcode";

create extension if not exists wrappers with schema extensions;

create foreign data wrapper stripe_wrapper
  handler stripe_fdw_handler
  validator stripe_fdw_validator;

-- create server stripe_server
--   foreign data wrapper stripe_wrapper
--   options (
--     api_key_id (select key_id from vault.secrets where name = 'stripe';), -- Retrieve key_id from the first statement
--     api_url 'https://api.stripe.com/v1/'  -- Stripe API base URL, optional. Default is 'https://api.stripe.com/v1/'
--   );

create schema if not exists "stripe";

create foreign table stripe.accounts (
  id text,
  business_type text,
  country text,
  email text,
  type text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'accounts'
  );

create foreign table stripe.checkout_sessions (
  id text,
  customer text,
  payment_intent text,
  subscription text,
  attrs jsonb
)
  server stripe_server
  options (
    object 'checkout/sessions',
    rowid_column 'id'
  );

create foreign table stripe.customers (
  id text,
  email text,
  name text,
  description text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'customers',
    rowid_column 'id'
  );

create foreign table stripe.invoices (
  id text,
  customer text,
  subscription text,
  status text,
  total bigint,
  currency text,
  period_start timestamp,
  period_end timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'invoices'
  );

create foreign table stripe.prices (
  id text,
  active bool,
  currency text,
  product text,
  unit_amount bigint,
  type text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'prices'
  );

create foreign table stripe.products (
  id text,
  name text,
  active bool,
  default_price text,
  description text,
  created timestamp,
  updated timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'products',
    rowid_column 'id'
  );


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

create policy "Enable insert for service role only"
on "public"."qrcode"
as permissive
for insert
to service_role
with check (true);





