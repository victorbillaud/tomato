drop policy "Enable delete for users based on user_id" on "public"."conversation";

drop policy "Enable insert with item_id for item owner only" on "public"."conversation";

drop policy "Enable update for owner id" on "public"."conversation";

drop policy "Enable select for authenticated users only" on "public"."conversation";

alter table "public"."conversation" add column "token" character varying;

create policy "Enable insert for authenticated users only"
on "public"."conversation"
as permissive
for insert
to service_role
with check (true);


create policy "Enable select for authenticated users only"
on "public"."conversation"
as permissive
for select
to authenticated, service_role
using (((auth.uid() = owner_id) OR (auth.uid() = finder_id)));
