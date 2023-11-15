
import { createClient } from '@supabase/supabase-js'
import { Database } from 'supabase_types'
import { getEnvVariable } from '../common/envService'

// Create a single supabase client for interacting with your database and act as a singleton

const supabaseUrl = getEnvVariable('SUPABASE_URL')
const supabaseKey = getEnvVariable('SUPABASE_KEY')

console.log(supabaseUrl, supabaseKey)

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export function getSupabase() {
    return supabase
}

