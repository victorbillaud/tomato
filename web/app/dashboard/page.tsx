import { Card } from '@/components/common/card';
import { Text } from '@/components/common/text';
import { createClient } from '@/utils/supabase/server';
import { listItems } from '@utils/lib/item/services';
import { cookies } from 'next/headers';

export default async function Dashboard() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: items, error } = await listItems(supabase);

  if (error) {
    throw error;
  }

  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center gap-3 p-1'>
      {items && items.length > 0 ? (
        items.map((item) => (
          <Card className='w-full p-4' key={item.id}>
            <h2 className='text-lg font-bold'>{item.name}</h2>
            <p>ID: {item.id}</p>
            <p>Created At: {item.created_at}</p>
            <p>Description: {item.description || 'N/A'}</p>
            <p>Activated: {item.activated ? 'Yes' : 'No'}</p>
            <p>Found: {item.found ? 'Yes' : 'No'}</p>
            <p>Found At: {item.found_at || 'N/A'}</p>
            <p>Lost: {item.lost ? 'Yes' : 'No'}</p>
            <p>Lost At: {item.lost_at || 'N/A'}</p>
            <p>User ID: {item.user_id}</p>
            <p>QRCode ID: {item.qrcode_id || 'N/A'}</p>

            {item.qrcode && item.qrcode.length > 0 && (
              <div>
                <h3 className='text-md mt-4 font-semibold'>QRCode:</h3>
                <ul>
                  {item.qrcode.map((qrcode, index) => (
                    <li key={index}>
                      <p>ID: {qrcode.id}</p>
                      <p>Created At: {qrcode.created_at}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        ))
      ) : (
        <div className='flex w-full flex-col items-center justify-center gap-3'>
          <Text variant='body' className='text-center opacity-40'>
            If you want to add a new item, click on the add item button.
          </Text>
        </div>
      )}
    </div>
  );
}
