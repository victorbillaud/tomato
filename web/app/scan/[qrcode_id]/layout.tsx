import { createClient } from '@/utils/supabase/server';
import { getItemFromQrCodeId } from '@utils/lib/item/services';
import { getQRCode } from '@utils/lib/qrcode/services';
import { insertScan } from '@utils/lib/scan/services';
import { Database } from '@utils/lib/supabase/supabase_types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const handleScan = async ({
  item_id: itemId,
  qrcode_id: qrCodeId,
  location,
}: Database['public']['Tables']['scan']['Insert']) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await insertScan(supabase, {
    item_id: itemId,
    qrcode_id: qrCodeId,
    location: location,
  });

  if (error) {
    console.error(error);
    throw new Error("Couldn't insert Scan");
  }

  if (data) {
    return data;
  }
};

export default async function ScanLayout(props: {
  children: React.ReactNode;
  activation: React.ReactNode;
  creation: React.ReactNode;
  params: { qrcode_id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: qrCode, error: getQrError } = await getQRCode(
    supabase,
    props.params.qrcode_id
  );

  if (getQrError) {
    console.error(getQrError);
    throw new Error("Couldn't fetch QR Code");
  }

  // FINDER FLOW
  // IF USER NOT LOGGED IN OR NOT OWNER => CHILDREN
  if (user == null || user.id !== qrCode?.user_id) {
    await handleScan({
      item_id: null,
      qrcode_id: qrCode?.id,
      location: null,
    });
    return <>{props.children}</>;
  }

  // OWNER FLOW
  // IF QR CODE IS NOT LINKED TO AN ITEM => CREATION PAGE
  if (qrCode?.item_id == null) {
    await handleScan({
      item_id: null,
      qrcode_id: qrCode?.id,
      location: null,
    });
    return <>{props.creation}</>;
    // IF QR CODE IS LINKED TO AN ITEM => ACTIVATION PAGE
  } else {
    const { data: item, error: getItemError } = await getItemFromQrCodeId(
      supabase,
      props.params.qrcode_id
    );

    if (getItemError) {
      console.error(getItemError);
      throw new Error("Couldn't fetch Item");
    }

    if (item) {
      await handleScan({
        item_id: item?.id,
        qrcode_id: qrCode?.id,
        location: null,
      });
    }

    if (item && item?.activated) {
      redirect(`/dashboard/item/${item.id}`);
    }

    if (item && !item?.activated) {
      return <>{props.activation}</>;
    }

    return <>{props.children}</>;
  }
}
