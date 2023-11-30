import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

/*

Edge Functions have access to these secrets by default:

SUPABASE_URL: The API gateway for your Supabase project.
SUPABASE_ANON_KEY: The anon key for your Supabase API. This is safe to use in a browser when you have Row Level Security enabled.
SUPABASE_SERVICE_ROLE_KEY: The service_role key for your Supabase API. This is safe to use in Edge Functions, but it should NEVER be used in a browser. This key will bypass Row Level Security.
SUPABASE_DB_URL: The URL for your PostgreSQL database. You can use this to connect directly to your database.

*/

const handler = async (_request: Request): Promise<Response> => {
  if (_request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const authHeader = _request.headers.get('Authorization')!

    const supabase = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )
    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // And we can run queries in the context of our authenticated user
    const { data, error } = await supabase.from('profiles').select('*')
    if (error) throw error

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
}

Deno.serve(handler)
