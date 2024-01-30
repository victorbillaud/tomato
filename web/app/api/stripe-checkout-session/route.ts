import { stripe } from '@/utils/stripe/stripe';
import { createClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { getCustomerId } from '@utils/lib/stripe/services';
import { Database } from '@utils/lib/supabase/supabase_types';
import { getUserDetails } from '@utils/lib/user/services';
import { cookies } from 'next/headers';

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

async function createOrRetrieveCustomer(
  supabase: SupabaseClient<Database>,
  email: string | undefined,
  id: string,
  name: string
) {
  const { stripe_customer_id, error } = await getCustomerId(supabase, id);

  if (error) {
    return { error };
  }

  if (stripe_customer_id) {
    return { stripe_customer_id };
  }

  const customerData: {
    metadata: { supabaseUUID: string };
    email?: string;
    id?: string;
    name?: string;
  } = {
    id: id,
    metadata: {
      supabaseUUID: id,
    },
  };
  if (email) customerData.email = email;
  if (name) customerData.name = name;

  const customer = await stripe.customers.create(customerData);

  const {
    stripe_customer_id: stripe_customer_id_created,
    error: creation_error,
  } = await getCustomerId(supabase, id);

  if (creation_error) {
    return { error: creation_error };
  }

  if (!stripe_customer_id_created) {
    console.log(customer);
    return { error: 'Customer not created' };
  }

  return { stripe_customer_id: customer.id };
}

export async function POST(req: Request) {
  if (req.method === 'POST') {
    // 1. Destructure the price and quantity from the POST body
    const { price, quantity = 1, metadata = {} } = await req.json();

    try {
      // 2. Get the user from Supabase auth
      const cookiesStore = cookies();
      const supabase = createClient(cookiesStore);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return new Response(
          JSON.stringify({
            error: {
              statusCode: 500,
              message: 'You must be logged to buy a product',
            },
          }),
          { status: 500 }
        );
      }

      const { user: profile } = await getUserDetails(supabase, user?.id || '');

      // 3. Retrieve or create the customer in Stripe
      const { stripe_customer_id, error } = await createOrRetrieveCustomer(
        supabase,
        user?.email,
        user?.id || '',
        profile?.full_name || ''
      );

      if (error) {
        console.log(error);
        return new Response(JSON.stringify(error), { status: 500 });
      }

      // 4. Create a checkout session in Stripe
      let session;
      if (price.type === 'one_time') {
        session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          billing_address_collection: 'required',
          customer: stripe_customer_id,
          customer_update: {
            address: 'auto',
          },
          line_items: [
            {
              price: price.id,
              quantity,
            },
          ],
          mode: 'payment',
          allow_promotion_codes: true,
          success_url: `${getURL()}/shop/order/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${getURL()}/shop`,
        });
      } else {
        return new Response(
          JSON.stringify({
            error: { statusCode: 500, message: 'Price type is not supported' },
          }),
          { status: 500 }
        );
      }

      if (session) {
        return new Response(JSON.stringify({ sessionId: session.id }), {
          status: 200,
        });
      } else {
        return new Response(
          JSON.stringify({
            error: { statusCode: 500, message: 'Session is not defined' },
          }),
          { status: 500 }
        );
      }
    } catch (err: any) {
      console.log(err);
      return new Response(
        JSON.stringify({ statusCode: 500, message: err.message }),
        { status: 500 }
      );
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405,
    });
  }
}
