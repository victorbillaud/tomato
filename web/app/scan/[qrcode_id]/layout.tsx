import { fetchLocationByIP } from '@/utils/ip';
import { createClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { getItemFromQrCodeId } from '@utils/lib/item/services';
import { getQRCode } from '@utils/lib/qrcode/services';
import { insertScan } from '@utils/lib/scan/services';
import { Database, Json } from '@utils/lib/supabase/supabase_types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Tomato - Scan',
};

const handleScan = async (
  supabase: SupabaseClient<Database>,
  itemId: string | null,
  qrCodeId: string,
  scanTypes: Database['public']['Enums']['ScanType'][] = []
) => {
  const ipMetadata = await fetchLocationByIP();

  const { error } = await insertScan(supabase, {
    item_id: itemId,
    qrcode_id: qrCodeId,
    type: scanTypes,
    ip_metadata: JSON.stringify(ipMetadata) as Json,
  });

  if (error) {
    console.error(error, { itemId, qrCodeId, scanTypes });
    throw new Error("Couldn't insert Scan");
  }
};

const getUserAndQrCode = async (
  supabase: SupabaseClient<Database>,
  qrCodeId: string
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: qrCode } = await getQRCode(supabase, qrCodeId);
  return { user, qrCode };
};

export default async function ScanLayout(props: {
  children: React.ReactNode;
  activation: React.ReactNode;
  creation: React.ReactNode;
  params: { qrcode_id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { user, qrCode } = await getUserAndQrCode(
    supabase,
    props.params.qrcode_id
  );

  // Finder Flow
  if (!user || user.id !== qrCode?.user_id) {
    await handleScan(supabase, qrCode?.item_id || null, props.params.qrcode_id);
    return <>{props.children}</>;
  }

  // Owner Flow
  if (!qrCode?.item_id) {
    await handleScan(supabase, null, props.params.qrcode_id, [
      'owner_scan',
      'creation',
    ]);
    return <>{props.creation}</>;
  } else {
    const { data: item, error: itemError } = await getItemFromQrCodeId(
      supabase,
      props.params.qrcode_id
    );
    if (itemError) {
      console.error(itemError);
      throw new Error("Couldn't fetch Item");
    }

    if (!item) {
      await handleScan(supabase, null, props.params.qrcode_id, [
        'owner_scan',
        'creation',
      ]);
      return <>{props.creation}</>;
    }

    if (item?.activated) {
      await handleScan(supabase, item?.id, props.params.qrcode_id, [
        'owner_scan',
      ]);
      redirect(`/dashboard/item/${item.id}`);
    } else {
      await handleScan(supabase, item?.id, props.params.qrcode_id, [
        'owner_scan',
        'activation',
      ]);
      return <>{props.activation}</>;
    }
  }
}
