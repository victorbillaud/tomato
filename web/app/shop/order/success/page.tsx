import { Icon } from '@/components/common/icon';
import { Text } from '@/components/common/text';
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

  console.log(session, lineItems);

  return (
    <div className='flex w-full max-w-6xl flex-1 flex-col items-start justify-start gap-20 px-3'>
      <div className='flex flex-col items-center justify-center gap-2 md:flex-row'>
        <Icon
          name='circle-check'
          size={100}
          color='text-green-500 dark:text-green-500'
        />
        <div className='flex flex-col items-start justify-center gap-2'>
          <Text variant='h1'>Order Success</Text>
          <Text variant='body'>
            Thank you for your purchase <strong>{customer.name}</strong>. You
            will receive an email shortly with your receipt.
          </Text>

          <Text variant='caption' className='opacity-70'>
            All the details about your order are below.
          </Text>
        </div>
      </div>

      <div className='mt-6 w-full'>
        <Text variant='h3' className='mb-4'>
          Order Information
        </Text>

        <div className='flex w-full flex-col gap-4 rounded-md border border-stone-300 p-4 shadow-md dark:border-stone-700'>
          <div className='flex items-center justify-between p-2'>
            <Text variant='body'>Order ID</Text>
            <Text variant='body'>{session.id}</Text>
          </div>

          <div className='flex items-center justify-between p-2'>
            <Text variant='body'>Date</Text>
            <Text variant='body'>
              {new Date(session.created * 1000).toLocaleDateString()}
            </Text>
          </div>

          <div className='flex items-center justify-between p-2'>
            <Text variant='body'>Email</Text>
            <Text variant='body'>{customer.email}</Text>
          </div>
        </div>
      </div>

      <div className='mt-6 w-full'>
        <Text variant='h3' className='mb-4'>
          Order Details
        </Text>

        <div className='flex w-full flex-col gap-4 rounded-md border border-stone-300 p-4 shadow-md dark:border-stone-700'>
          {lineItems.data.map((item) => (
            <div
              key={item.id}
              className='flex items-center justify-between p-2'
            >
              <div>
                <Text variant='body'>{item.description}</Text>
                <Text variant='caption'>
                  Quantity: {item.quantity} x €{item.price.unit_amount / 100}
                </Text>
              </div>
              <Text variant='body'>
                €{(item.amount_total / 100).toFixed(2)}
              </Text>
            </div>
          ))}

          <div className='mt-4 flex items-center justify-end'>
            <Text variant='body' className='mr-2'>
              Total:
            </Text>
            <Text variant='body' weight={600} color='text-primary-600'>
              €{(session.amount_total / 100).toFixed(2)}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
