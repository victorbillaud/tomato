import { insertQRCode } from '../qrcode/services';
import { getSupabase } from '../supabase/services';

async function main() {
  const sp = getSupabase();

  const args = process.argv.slice(2);

  const user_id = args[0];

  if (!user_id) {
    throw new Error('user_id is required');
  }

  const { data, error } = await insertQRCode(sp, {
    user_id,
  });

  if (error) {
    throw new Error(error.message);
  }

  console.log(data);
}

main();
