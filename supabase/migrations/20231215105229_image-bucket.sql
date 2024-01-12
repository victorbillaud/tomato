drop policy "Anyone can upload an avatar." on "storage"."objects";

drop policy "Avatar images are publicly accessible." on "storage"."objects";

insert into storage.buckets
  (id, name, public)
values
  ('items-images', 'items-images', true);

create policy "Allow everyone to read images 1m5g5k5_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'items-images'::text));


create policy "Give users access to own folder 1m5g5k5_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'items-images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1m5g5k5_1"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'items-images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1m5g5k5_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'items-images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1m5g5k5_3"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'items-images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



