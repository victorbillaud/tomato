import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/supabase_types';

export async function insertScan(
  supabaseInstance: SupabaseClient<Database>,
  scan: Pick<
    Database['public']['Tables']['scan']['Insert'],
    'item_id' | 'qrcode_id' | 'type' | 'ip_metadata' | 'geo_location_metadata'
  >
) {
  const {
    data: { user },
  } = await supabaseInstance.auth.getUser();

  const userType: Database['public']['Enums']['ScanType'] = user
    ? 'registered_user_scan'
    : 'non_registered_user_scan';

  const types = scan.type ? [...scan.type, userType] : [userType];
  if (scan.type?.includes('owner_scan')) types.pop();

  const scanToInsert: Database['public']['Tables']['scan']['Insert'] = {
    ...scan,
    user_id: user?.id,
    type: types,
  };

  const { data, error } = await supabaseInstance
    .from('scan')
    .insert(scanToInsert)
    .select('*')
    .single();

  return { data, error };
}

export async function deleteScan(
  supabaseInstance: SupabaseClient<Database>,
  scanId: string
) {
  const { error } = await supabaseInstance
    .from('scan')
    .delete()
    .eq('id', scanId);

  return { error };
}

export async function listScans(
  supabaseInstance: SupabaseClient<Database>,
  itemId?: string,
  qrcodeId?: string
) {
  let query = supabaseInstance
    .from('scan')
    .select('*')
    .order('created_at', { ascending: false });

  if (itemId) {
    query = query.eq('item_id', itemId);
  }

  if (qrcodeId) {
    query = query.eq('qrcode_id', qrcodeId);
  }

  const { data, error } = await query;

  return { data, error };
}

export async function updateGeoLocationMetadata(
  supabaseInstance: SupabaseClient<Database>,
  scanId: string,
  geoLocationMetadata: GeolocationPosition
) {
  const { data, error } = await supabaseInstance
    .from('scan')
    .update({
      geo_location_metadata: {
        latitude: geoLocationMetadata.coords.latitude,
        longitude: geoLocationMetadata.coords.longitude,
        accuracy: geoLocationMetadata.coords.accuracy,
        altitude: geoLocationMetadata.coords.altitude,
        altitudeAccuracy: geoLocationMetadata.coords.altitudeAccuracy,
        heading: geoLocationMetadata.coords.heading,
        speed: geoLocationMetadata.coords.speed,
        timestamp: geoLocationMetadata.timestamp,
      },
    })
    .eq('id', scanId)
    .select('*')
    .single();

  return { data, error };
}

export async function getScan(
  supabaseInstance: SupabaseClient<Database>,
  itemId: string,
  qrCodeId: string
) {
  const { data, error } = await supabaseInstance
    .from('scan')
    .select('*')
    .eq('item_id', itemId)
    .eq('qrcode_id', qrCodeId)
    .limit(1)
    .single();

  return { data, error };
}
