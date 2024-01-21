import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "npm:stripe@^14.13.0";
import { adjectives } from '../_shared/qrcode/adjectives.ts';
import { fruitsVegetables } from '../_shared/qrcode/fruits-vegetables.ts';
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
      const productId = item.price?.lookup_key as keyof typeof itemsHandlerDict;
      await itemsHandlerDict[productId!](
        receivedEvent.data.object.customer,
        itemsQuantityDict[productId!],
      );
    });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});

const itemsHandlerDict = {
  "qrcode_unique": handleQrCodeBuy,
  "qrcode_3_pack": handleQrCodeBuy,
  "qrcode_10_pack": handleQrCodeBuy,
};

const itemsQuantityDict = {
  "qrcode_unique": 1,
  "qrcode_3_pack": 3,
  "qrcode_10_pack": 10,
};

async function handleQrCodeBuy(userId: string, numberOfQRCodes: number) {
  const supabaseClient = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const qrCodeObjects: Database["public"]["Tables"]["qrcode"]["Insert"][] = [];

  for (let i = 0; i < numberOfQRCodes; i++) {
    qrCodeObjects.push({
      user_id: userId,
      name: generateQRCodeName(),
    });
  }

  const { data, error } = await insertQRCodes(supabaseClient, qrCodeObjects);

  if (error) {
    return error;
  }

  return data;
}

export async function insertQRCodes(
  supabaseInstance: SupabaseClient<Database>,
  qrCodeObjects: Database["public"]["Tables"]["qrcode"]["Insert"][],
) {
  const { data, error } = await supabaseInstance
    .from("qrcode")
    .insert(qrCodeObjects)
    .select("*");

  if (error) {
    return { data, error };
  }

  const qrCodeResults = await createQrCodeImages(supabaseInstance, data!);

  return qrCodeResults;
}

async function createQrCodeImages(
  supabaseInstance: SupabaseClient<Database>,
  qrCodeObjects: Database["public"]["Tables"]["qrcode"]["Row"][],
) {const upsertData = qrCodeObjects.map((qrCode) => {
    const qrCodeURL = buildQRCodeURL(qrCode.id);

    return {
      id: qrCode.id,
      user_id: qrCode.user_id,
      barcode_data: qrCodeURL,
    };
  });

  const { data, error } = await supabaseInstance
    .from("qrcode")
    .upsert(upsertData)
    .select();

  return { data, error };
}

type Language = 'en';

export const generateQRCodeName = (language: Language = 'en'): string => {
  const fruitVegetable =
    fruitsVegetables[language][
      Math.floor(Math.random() * fruitsVegetables[language].length)
    ];
  const adjective =
    adjectives[language][
      Math.floor(Math.random() * adjectives[language].length)
    ];

  return `${adjective} ${fruitVegetable}`;
};


function buildQRCodeURL(qrCodeId: string): string {
  const baseURL = Deno.env.get("WEBSITE_URL") ?? "http://localhost:3000";

  const qrCodeURL = `${baseURL}/scan/${qrCodeId}`;

  return qrCodeURL;
}
