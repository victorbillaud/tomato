alter table "public"."profiles" drop column "website";

alter table "public"."profiles" add column "email_notifications" boolean not null default true;

alter table "public"."profiles" add column "message_notifications" boolean not null default true;

alter table "public"."profiles" add column "phone" text;

