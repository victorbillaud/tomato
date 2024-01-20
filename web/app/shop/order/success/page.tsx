import { stripe } from '@/utils/stripe/stripe';

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await stripe.checkout.sessions.retrieve(
    searchParams?.session_id as string
  );

  const customer = await stripe.customers.retrieve(session.customer);

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

  return (
    <div>
      <h1>Order Success</h1>
      <ul>
        <li>Session ID: {session.id}</li>
        <li>Customer: {customer.name}</li>
      </ul>
      <h2>Line Items</h2>
      <ul>
        {lineItems.data.map((item) => (
          <li key={item.id}>
            {item.description} - {item.amount_total}
          </li>
        ))}
      </ul>
    </div>
  );
}
