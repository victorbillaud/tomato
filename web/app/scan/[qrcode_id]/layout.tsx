import { createClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { getItemFromQrCodeId } from '@utils/lib/item/services';
import { getQRCode } from '@utils/lib/qrcode/services';
import { insertScan } from '@utils/lib/scan/services';
import { Database } from '@utils/lib/supabase/supabase_types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const handleScan = async (
  supabase: SupabaseClient<Database>,
  itemId: string | null,
  qrCodeId: string
) => {
  const { error } = await insertScan(supabase, {
    item_id: itemId,
    qrcode_id: qrCodeId,
  });

  if (error) {
    console.error(error);
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
  const { data: qrCode, error: qrError } = await getQRCode(supabase, qrCodeId);

  if (qrError) {
    console.error(qrError);
    throw new Error("Couldn't fetch QR Code");
  }
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
    await handleScan(supabase, null, props.params.qrcode_id);
    return <>{props.children}</>;
  }

  // Owner Flow
  if (!qrCode?.item_id) {
    await handleScan(supabase, null, props.params.qrcode_id);
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
      return <>{props.creation}</>;
    }

    if (item?.activated) {
      redirect(`/dashboard/item/${item.id}`);
    } else {
      await handleScan(supabase, item?.id, props.params.qrcode_id);
      return <>{props.activation}</>;
    }
  }
}
