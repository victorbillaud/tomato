create table "public"."conversation" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "item_id" uuid not null,
    "owner_id" uuid not null,
    "finder_id" uuid
);


alter table "public"."conversation" enable row level security;

create table "public"."message" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "conversation_id" uuid not null,
    "content" text not null,
    "sender_id" uuid
);


alter table "public"."message" enable row level security;

CREATE UNIQUE INDEX conversation_pkey ON public.conversation USING btree (id);

CREATE UNIQUE INDEX message_pkey ON public.message USING btree (id);

alter table "public"."conversation" add constraint "conversation_pkey" PRIMARY KEY using index "conversation_pkey";

alter table "public"."message" add constraint "message_pkey" PRIMARY KEY using index "message_pkey";

alter table "public"."conversation" add constraint "conversation_finder_id_fkey" FOREIGN KEY (finder_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."conversation" validate constraint "conversation_finder_id_fkey";

alter table "public"."conversation" add constraint "conversation_item_id_fkey" FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE SET NULL not valid;

alter table "public"."conversation" validate constraint "conversation_item_id_fkey";

alter table "public"."conversation" add constraint "conversation_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."conversation" validate constraint "conversation_owner_id_fkey";

alter table "public"."message" add constraint "message_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES conversation(id) ON DELETE CASCADE not valid;

alter table "public"."message" validate constraint "message_conversation_id_fkey";

alter table "public"."message" add constraint "message_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."message" validate constraint "message_sender_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_conversations_with_last_message(user_id uuid)
 RETURNS TABLE(conversation_id uuid, created_at timestamp with time zone, updated_at timestamp with time zone, item_id uuid, owner_id uuid, finder_id uuid, last_message text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS conversation_id,
    c.created_at,
    c.updated_at,
    c.item_id,
    c.owner_id,
    c.finder_id,
    (
      SELECT m.content
      FROM message m
      WHERE m.conversation_id = c.id
      ORDER BY m.created_at DESC
      LIMIT 1
    ) AS last_message
  FROM
    conversation c
  WHERE
    c.owner_id = user_id OR c.finder_id = user_id
  ORDER BY c.updated_at DESC;
END;
$function$
;

create policy "Enable delete for users based on user_id"
on "public"."conversation"
as permissive
for delete
to public
using ((auth.uid() = owner_id));


create policy "Enable insert with item_id for item owner only"
on "public"."conversation"
as permissive
for insert
to authenticated
with check (((EXISTS ( SELECT 1
   FROM item
  WHERE ((item.id = conversation.item_id) AND (item.user_id = auth.uid())))) AND (auth.uid() = owner_id)));


create policy "Enable select for authenticated users only"
on "public"."conversation"
as permissive
for select
to authenticated
using (((auth.uid() = owner_id) OR (auth.uid() = finder_id)));


create policy "Enable update for owner id"
on "public"."conversation"
as permissive
for update
to authenticated
using ((auth.uid() = owner_id))
with check ((auth.uid() = owner_id));


create policy "Enable insert for everyone"
on "public"."message"
as permissive
for insert
to anon, authenticated, service_role
with check (true);


create policy "Enable read access for member of the conversation"
on "public"."message"
as permissive
for select
to public
using (true);



