create extension if not exists "postgis" with schema "extensions";


create sequence "public"."test_tenant_id_seq";

create table "public"."scan" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "qrcode_id" uuid,
    "item_id" uuid,
    "user_id" uuid,
    "location" geography
);


alter table "public"."scan" enable row level security;

create table "public"."test_tenant" (
    "id" integer not null default nextval('test_tenant_id_seq'::regclass),
    "details" text
);


alter sequence "public"."test_tenant_id_seq" owned by "public"."test_tenant"."id";

CREATE UNIQUE INDEX scan_pkey ON public.scan USING btree (id);

CREATE UNIQUE INDEX test_tenant_pkey ON public.test_tenant USING btree (id);

alter table "public"."scan" add constraint "scan_pkey" PRIMARY KEY using index "scan_pkey";

alter table "public"."test_tenant" add constraint "test_tenant_pkey" PRIMARY KEY using index "test_tenant_pkey";

alter table "public"."scan" add constraint "scan_item_id_fkey" FOREIGN KEY (item_id) REFERENCES item(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."scan" validate constraint "scan_item_id_fkey";

alter table "public"."scan" add constraint "scan_qrcode_id_fkey" FOREIGN KEY (qrcode_id) REFERENCES qrcode(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."scan" validate constraint "scan_qrcode_id_fkey";

alter table "public"."scan" add constraint "scan_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."scan" validate constraint "scan_user_id_fkey";

create policy "Enable insert for everyone"
on "public"."scan"
as permissive
for insert
to public
with check (true);


create policy "Enable read for item owner only"
on "public"."scan"
as permissive
for select
to authenticated
using ((auth.uid() = ( SELECT item.user_id
   FROM item
  WHERE (item.id = scan.item_id))));



