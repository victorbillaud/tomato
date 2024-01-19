alter table "public"."profiles" drop column "website";

alter table "public"."profiles" add column "email_notifications" boolean not null default true;

alter table "public"."profiles" add column "message_notifications" boolean not null default true;

alter table "public"."profiles" add column "phone" text;

alter table "public"."profiles" alter column "avatar_url" set default 'https://nqhtfnmtcjxybsvxhqrh.supabase.co/storage/v1/object/sign/avatars/default_avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2RlZmF1bHRfYXZhdGFyLnBuZyIsImlhdCI6MTcwNTY3MzU0NCwiZXhwIjoxNzM3MjA5NTQ0fQ.rKZUN5KL56xJt3F0yr8AwOvW5NW-gNt8Kps5kWGSpNI&t=2024-01-19T14%3A12%3A24.180Z'::text;

alter table "public"."profiles" alter column "avatar_url" set not null;

create policy "Allow everyone to read images 1oj01fe_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));

create policy "Allow owner to do all operations on this folder 1oj01fe_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Allow owner to do all operations on this folder 1oj01fe_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Allow owner to do all operations on this folder 1oj01fe_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Allow owner to do all operations on this folder 1oj01fe_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



