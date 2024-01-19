drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Users can insert their own profile." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

alter table "public"."profiles" drop column "website";

alter table "public"."profiles" add column "email_notifications" boolean not null default true;

alter table "public"."profiles" add column "message_notifications" boolean not null default true;

alter table "public"."profiles" add column "phone" text;

alter table "public"."profiles" alter column "avatar_url" set default 'https://nqhtfnmtcjxybsvxhqrh.supabase.co/storage/v1/object/sign/avatars/default_avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2RlZmF1bHRfYXZhdGFyLnBuZyIsImlhdCI6MTcwNTY3MzU0NCwiZXhwIjoxNzM3MjA5NTQ0fQ.rKZUN5KL56xJt3F0yr8AwOvW5NW-gNt8Kps5kWGSpNI&t=2024-01-19T14%3A12%3A24.180Z'::text;

alter table "public"."profiles" alter column "avatar_url" set not null;

set check_function_bodies = off;

create or replace view "public"."public_profile_view" as  SELECT profiles.id,
    profiles.username,
    profiles.avatar_url
   FROM profiles;


CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  if new.raw_user_meta_data->>'avatar_url' is not null then
    insert into public.profiles (id, full_name, avatar_url)
    values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  else
    insert into public.profiles (id, full_name)
    values (new.id, new.raw_user_meta_data->>'full_name');
  end if;
  return new;
end;$function$
;

create policy "Enable insert for authenticated users only"
on "public"."profiles"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for the user himself"
on "public"."profiles"
as permissive
for select
to authenticated
using ((auth.uid() = id));


create policy "Enable update access for the user himself"
on "public"."profiles"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));

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



