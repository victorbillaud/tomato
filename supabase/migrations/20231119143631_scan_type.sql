create type "public"."ScanType" as enum ('activation', 'creation', 'owner_scan', 'registered_user_scan', 'non_registered_user_scan');

alter table "public"."scan" add column "type" "ScanType"[];


