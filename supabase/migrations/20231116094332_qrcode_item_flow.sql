create table "public"."item" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "description" text,
    "activated" boolean not null default false,
    "found" boolean not null default false,
    "found_at" timestamp without time zone,
    "lost" boolean not null default false,
    "lost_at" timestamp without time zone,
    "user_id" uuid not null,
    "qrcode_id" uuid
);


alter table "public"."item" enable row level security;

create table "public"."qrcode" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "barcode_data" text,
    "item_id" uuid,
    "user_id" uuid not null
);


alter table "public"."qrcode" enable row level security;

CREATE UNIQUE INDEX item_pkey ON public.item USING btree (id);

CREATE UNIQUE INDEX qrcode_pkey ON public.qrcode USING btree (id);

alter table "public"."item" add constraint "item_pkey" PRIMARY KEY using index "item_pkey";

alter table "public"."qrcode" add constraint "qrcode_pkey" PRIMARY KEY using index "qrcode_pkey";

alter table "public"."item" add constraint "item_qrcode_id_fkey" FOREIGN KEY (qrcode_id) REFERENCES qrcode(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."item" validate constraint "item_qrcode_id_fkey";

alter table "public"."item" add constraint "item_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."item" validate constraint "item_user_id_fkey";

alter table "public"."qrcode" add constraint "qrcode_item_id_fkey" FOREIGN KEY (item_id) REFERENCES item(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."qrcode" validate constraint "qrcode_item_id_fkey";

alter table "public"."qrcode" add constraint "qrcode_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."qrcode" validate constraint "qrcode_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_item_id_uniqueness()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Check if item_id is not null and exists in another qrcode
    IF NEW.item_id IS NOT NULL AND
       EXISTS(SELECT 1 FROM qrcode WHERE item_id = NEW.item_id AND id != NEW.id) THEN
        RAISE EXCEPTION 'Another qrcode with the same item_id already exists.';
    END IF;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_qrcode_id_uniqueness()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Check if qrcode_id is not null and exists in another item
    IF NEW.qrcode_id IS NOT NULL AND
       EXISTS(SELECT 1 FROM item WHERE qrcode_id = NEW.qrcode_id AND id != NEW.id) THEN
        RAISE EXCEPTION 'Another item with the same qrcode_id already exists.';
    END IF;

    RETURN NEW;
END;
$function$
;

create policy "Enable insert for authenticated users only"
on "public"."item"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for owner only"
on "public"."item"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable update for owner only"
on "public"."item"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."qrcode"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for owner only"
on "public"."qrcode"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable update for owner only"
on "public"."qrcode"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


CREATE TRIGGER trigger_check_qrcode_id_uniqueness BEFORE INSERT OR UPDATE ON public.item FOR EACH ROW EXECUTE FUNCTION check_qrcode_id_uniqueness();

CREATE TRIGGER trigger_check_item_id_uniqueness BEFORE INSERT OR UPDATE ON public.qrcode FOR EACH ROW EXECUTE FUNCTION check_item_id_uniqueness();


