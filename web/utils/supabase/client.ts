import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@utils/lib/supabase/supabase_types'

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
