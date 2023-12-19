import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createScanAlertEmail } from "../_shared/email_template.ts";
import { middleware } from "../_shared/middleware.ts";
import { Database } from "../_shared/supabase_types.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

type ScanRecord = Database["public"]["Tables"]["scan"]["Row"];
type ItemRecord = Database["public"]["Tables"]["item"]["Row"];
type NotificationInsert =
  Database["public"]["Tables"]["notification"]["Insert"];

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: ScanRecord;
  schema: "public";
  old_record: null | ScanRecord;
}

const verifyPayload = (payload: WebhookPayload) => {
  if (payload.table !== "scan") {
    throw new Error("Invalid table");
  }

  if (payload.schema !== "public") {
    throw new Error("Invalid schema");
  }

  if (payload.type !== "INSERT") {
    throw new Error("Invalid type");
  }

  if (payload.record.item_id === null) {
    throw new Error("No item related to scan");
  }
};

const shouldNotifyOwner = (scan: ScanRecord, item: ItemRecord) => {
  if (
    item.lost && scan.type &&
    scan.type?.filter((type) =>
      type === "owner_scan" || type === "activation" || type === "creation"
    ).length === 0
  ) {
    return true;
  }

  if (
    item.notify_anyway && scan.type &&
    scan.type?.filter((type) =>
      type === "owner_scan" || type === "activation" || type === "creation"
    ).length === 0
  ) {
    return true;
  }

  return false;
};

const fetchItem = async (itemId: string) => {
  const supabaseClient = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: item, error } = await supabaseClient
    .from("item")
    .select("*")
    .eq("id", itemId)
    .single();

  if (error) {
    throw new Error("Error fetching item");
  }

  return item;
};

const insertNotification = async (notification: NotificationInsert) => {
  const supabaseClient = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: notificationData, error } = await supabaseClient
    .from("notification")
    .insert(notification);

  if (error) {
    throw new Error("Error inserting notification");
  }

  return notificationData;
};

const getUserEmail = async (userId: string) => {
  const supabaseClient = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: { user } } = await supabaseClient.auth.admin.getUserById(
    userId,
  );

  return user?.email;
};

const sendEmail = async (scan: ScanRecord, item: ItemRecord) => {
  const userEmail = await getUserEmail(item.user_id);
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Tomato <team@tomato.victorbillaud.fr>",
        to: userEmail,
        subject: "Your item has been scanned",
        html: createScanAlertEmail(
          item.name,
          scan.created_at,
          "https://tomato.victorbillaud.fr/dashboard/item/" + item.id,
        ),
      }),
    });
  } catch (error) {
    throw new Error("Error sending email");
  }
};

const handler = async (_request: Request): Promise<Response> => {
  try {
    const payload: WebhookPayload = await _request.json();

    verifyPayload(payload);

    const item = await fetchItem(payload.record.item_id!);

    if (shouldNotifyOwner(payload.record, item)) {
      await insertNotification({
        user_id: item.user_id,
        type: "email",
        title: `Your item "${item.name}" has been scanned`,
        link: "/dashboard/item/" + item.id,
        metadata: {
          scan_id: payload.record.id,
          item_id: item.id,
          item_name: item.name,
          item_description: item.description,
          scan_type: payload.record.type,
          scan_created_at: payload.record.created_at,
        },
      });

      // await sendEmail(payload.record, item);

      return new Response(JSON.stringify({ message: "OK" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });

    } else {
      throw new Error("No need to notify owner");
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
};



Deno.serve((request: Request) => middleware(request, handler));
