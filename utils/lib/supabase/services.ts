
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { Database } from './supabase_types'

// Create a single supabase client for interacting with your database and act as a singleton

config({
    path: '.env.local'
})

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export function getSupabase() {
    return supabase
}

