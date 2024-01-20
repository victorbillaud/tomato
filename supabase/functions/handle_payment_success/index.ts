import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "npm:stripe@^14.13.0";
import { Database } from "../_shared/supabase_types.ts";

export const stripe = new Stripe(
  Deno.env.get("STRIPE_API_KEY_LIVE") ?? Deno.env.get("STRIPE_API_KEY") ?? "",
  {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: "2023-10-16",
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: "Next.js Subscription Starter",
      version: "0.1.0",
    },
  },
);

const cryptoProvider = Stripe.createSubtleCryptoProvider();

Deno.serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature") ?? "";
  const body = await req.text();
  let receivedEvent: Stripe.Event;
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get("STRIPE_SUCCESSFUL_PAYMENT_WEBHOOK_SECRET")!,
      undefined,
      cryptoProvider,
    );
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return new Response(err.message, { status: 400 });
  }

  if (receivedEvent.type === "checkout.session.completed") {
    // Verify if the checkout as been paid
    if (receivedEvent.data.object.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ message: "Payment not completed" }),
        { status: 400 },
      );
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(
      receivedEvent.data.object.id,
    );

    lineItems.data.forEach(async (item) => {
      console.log(item);

      const productId = item.price?.product as keyof typeof itemsHandlerDict;
      const result = await itemsHandlerDict[productId!](
        receivedEvent.data.object.customer,
      );
      console.log(result);
    });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});

const itemsHandlerDict = {
  "prod_PPXa1fY3TKtufl": handleQrCodeBuy,
};

async function handleQrCodeBuy(userId: string) {
  const supabaseClient = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data, error } = await insertQRCode(supabaseClient, userId);

  if (error) {
    return error;
  }

  return data;
}

export async function insertQRCode(
  supabaseInstance: SupabaseClient<Database>,
  userId: string,
): Promise<ReturnType<typeof createQrCodeImage>> {
  const qrCodeObject: Database["public"]["Tables"]["qrcode"]["Insert"] = {
    user_id: userId,
    name: "test",
  };

  const { data, error } = await supabaseInstance
    .from("qrcode")
    .insert(qrCodeObject)
    .select("*")
    .single();

  if (error) {
    return { data, error };
  }

  return await createQrCodeImage(supabaseInstance, data);
}

async function createQrCodeImage(
  supabaseInstance: SupabaseClient<Database>,
  qrCode: Database["public"]["Tables"]["qrcode"]["Row"],
) {
  const qrCodeURL = buildQRCodeURL(qrCode.id);

  const qrCodeObject: Database["public"]["Tables"]["qrcode"]["Update"] = {
    barcode_data: qrCodeURL,
  };

  const { data, error } = await supabaseInstance
    .from("qrcode")
    .update(qrCodeObject)
    .eq("id", qrCode.id)
    .select()
    .single();

  return { data, error };
}

function buildQRCodeURL(qrCodeId: string): string {
  const baseURL = Deno.env.get("WEBSITE_URL") ?? "http://localhost:3000";

  const qrCodeURL = `${baseURL}/scan/${qrCodeId}`;

  return qrCodeURL;
}
