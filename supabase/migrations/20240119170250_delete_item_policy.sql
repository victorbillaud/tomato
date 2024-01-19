alter table "public"."conversation" drop constraint "conversation_item_id_fkey";

alter table "public"."conversation" add constraint "conversation_item_id_fkey" FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE not valid;

alter table "public"."conversation" validate constraint "conversation_item_id_fkey";

create policy "Enable delete for users based on user_id"
on "public"."item"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));