import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { getItemFromQrCodeId } from '@utils/lib/item/services';
import { getQRCode } from '@utils/lib/qrcode/services';
import { insertScan } from '@utils/lib/scan/services';
import { Database, Json } from '@utils/lib/supabase/supabase_types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import FinderPage from './FinderPage';
import CreationPage from './CreationPage';
import ActivationPage from './ActivationPage';

export const metadata = {
  title: 'Tomato - Scan',
};

export const handleScan = async (
  supabase: SupabaseClient<Database>,
  itemId: string | null,
  qrCodeId: string,
  scanTypes: Database['public']['Enums']['ScanType'][] = []
) => {
  const { error } = await insertScan(supabase, {
    item_id: itemId,
    qrcode_id: qrCodeId,
    type: scanTypes,
    ip_metadata: null,
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

const Scan = async (props: { params: { qrcode_id: string } }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { user, qrCode } = await getUserAndQrCode(
    supabase,
    props.params.qrcode_id
  );

  // Finder Flow
  if (!user || user.id !== qrCode?.user_id) {
    return <FinderPage params={props.params} />;
  }

  // Owner Flow
  if (!qrCode?.item_id) {
    await handleScan(supabase, null, props.params.qrcode_id, [
      'owner_scan',
      'creation',
    ]);
    return <CreationPage params={props.params} />;
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
      return <CreationPage params={props.params} />;
    }

    if (item.activated) {
      redirect(`/dashboard/item/${item.id}`);
    } else {
      await handleScan(supabase, item?.id, props.params.qrcode_id, [
        'owner_scan',
        'activation',
      ]);
      return <ActivationPage params={props.params} />;
    }
  }
};

export default Scan;
