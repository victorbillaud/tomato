create type "public"."ScanType" as enum ('activation', 'creation', 'owner_scan', 'registered_user_scan', 'non_registered_user_scan');

alter table "public"."item" drop column "found";

alter table "public"."item" drop column "found_at";

alter table "public"."scan" add column "type" "ScanType"[];

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_scan_conditions()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  has_registered_user_scan BOOLEAN;
  has_non_registered_user_scan BOOLEAN;
  unique_elements "ScanType"[];
BEGIN
  -- Create a distinct array from the input array
  SELECT array_agg(elem) 
  INTO unique_elements 
  FROM (SELECT DISTINCT unnest(NEW.type) AS elem) AS dt;

  -- Check for duplicates by comparing lengths
  IF array_length(NEW.type, 1) <> array_length(unique_elements, 1) THEN
    RAISE EXCEPTION 'Duplicate values are not allowed in the type array';
  END IF;

  -- Check if both registered_user_scan and non_registered_user_scan are present
  has_registered_user_scan := 'registered_user_scan' = ANY (NEW.type);
  has_non_registered_user_scan := 'non_registered_user_scan' = ANY (NEW.type);

  IF has_registered_user_scan AND has_non_registered_user_scan THEN
    RAISE EXCEPTION 'registered_user_scan and non_registered_user_scan cannot be present at the same time';
  END IF;

  -- If all checks pass, allow the operation to proceed
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER check_scan_before_insert_or_update BEFORE INSERT OR UPDATE ON public.scan FOR EACH ROW EXECUTE FUNCTION check_scan_conditions();


