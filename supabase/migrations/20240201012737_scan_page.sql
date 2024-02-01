
alter table "public"."item" add column "scan_description" text;

alter table "public"."item" add column "scan_headline" text;

alter table "public"."item" add column "scan_show_avatar_url" boolean not null default false;

alter table "public"."item" add column "scan_show_full_name" boolean not null default false;

alter table "public"."item" add column "scan_show_item_name" boolean not null default true;

alter table "public"."item" add column "scan_show_phone" boolean not null default false;

alter table "public"."profiles" add column "scan_show_avatar_url" boolean not null default false;

alter table "public"."profiles" add column "scan_show_full_name" boolean not null default false;

alter table "public"."profiles" add column "scan_show_item_name" boolean not null default true;

alter table "public"."profiles" add column "scan_show_phone" boolean not null default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_scan_item_view(item_id uuid)
 RETURNS TABLE(id uuid, name text, lost boolean, lost_at timestamp without time zone, user_id uuid, qrcode_id uuid, image_path text, scan_headline text, scan_description text, owner_full_name text, owner_avatar_url text, owner_phone text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    i.id AS id,
    CASE
      WHEN i.scan_show_item_name THEN i.name
      ELSE NULL
    END AS name,
    i.lost AS lost,
    i.lost_at AS lost_at,
    i.user_id AS user_id,
    i.qrcode_id AS qrcode_id,
    i.image_path AS image_path,
    i.scan_headline AS scan_headline,
    i.scan_description AS scan_description,
    CASE
      WHEN i.scan_show_full_name THEN p.full_name
      ELSE NULL
    END AS owner_full_name,
    CASE
      WHEN i.scan_show_avatar_url THEN p.avatar_url
      ELSE NULL
    END AS owner_email,
    CASE
      WHEN i.scan_show_phone THEN p.phone
      ELSE NULL
    END AS owner_phone
  FROM
    public.item i
    JOIN public.profiles p ON i.user_id = p.id
  WHERE
    i.id = item_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_item_fields()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Fetch the related user's profile
  DECLARE
    user_profile public.profiles;
  BEGIN
    SELECT * INTO user_profile
    FROM public.profiles
    WHERE id = NEW.user_id;

    -- Update item fields based on scan_show values
    NEW.scan_show_avatar_url := user_profile.scan_show_avatar_url;
    NEW.scan_show_full_name := user_profile.scan_show_full_name;
    NEW.scan_show_item_name := user_profile.scan_show_item_name;
    NEW.scan_show_phone := user_profile.scan_show_phone;

    RETURN NEW;
  END;
END;
$function$
;

CREATE TRIGGER trigger_update_item_fields AFTER INSERT ON public.item FOR EACH ROW EXECUTE FUNCTION update_item_fields();


