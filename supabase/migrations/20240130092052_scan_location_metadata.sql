drop policy "Enable insert for authenticated users only" on "public"."scan";

alter table "public"."scan" add column "geo_location_metadata" jsonb;

alter table "public"."scan" add column "ip_metadata" jsonb;

create policy "Enable update for all users [TEMPORALLY]"
on "public"."scan"
as permissive
for update
to anon, authenticated
using (true)
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."scan"
as permissive
for insert
to anon, authenticated
with check (true);



