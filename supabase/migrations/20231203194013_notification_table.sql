create type "public"."NotificationType" as enum ('email', 'system');

create table "public"."notification" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null default auth.uid(),
    "title" text not null default ''::text,
    "metadata" json,
    "type" "NotificationType" not null default 'system'::"NotificationType",
    "is_read" boolean not null default false,
    "updated_at" timestamp with time zone not null default now(),
    "link" text
);


alter table "public"."notification" enable row level security;

CREATE UNIQUE INDEX notification_pkey ON public.notification USING btree (id);

alter table "public"."notification" add constraint "notification_pkey" PRIMARY KEY using index "notification_pkey";

alter table "public"."notification" add constraint "notification_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notification" validate constraint "notification_user_id_fkey";

create policy "Enable insert for service key only"
on "public"."notification"
as permissive
for insert
to service_role, authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."notification"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable update for users based on email"
on "public"."notification"
as permissive
for update
to authenticated, service_role
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));

alter table "public"."scan" alter column "user_id" drop default;

alter publication supabase_realtime add table notification;

CREATE TRIGGER on_item_scanned AFTER INSERT ON public.scan FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://nqhtfnmtcjxybsvxhqrh.supabase.co/functions/v1/notify_item_owner_on_scan', 'POST', '{"Content-type":"application/json","Authorization":"Bearer your_anon_key"}', '{}', '1000');


