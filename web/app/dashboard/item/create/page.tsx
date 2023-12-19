import { createClient } from '@/utils/supabase/server';
import { listQRCode } from '@utils/lib/qrcode/services';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function CreateLayout() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: qrCodes, error } = await listQRCode(supabase);

  if (error || !qrCodes || qrCodes.length === 0) {
    throw new Error("You don't have any QR Code");
  }

  redirect(`/dashboard/item/create/${qrCodes[0].id}`);
}
