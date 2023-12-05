import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {

    const cookieStore = cookies()
    const supabaseClient = createClient(cookieStore)

    const token = (await supabaseClient.auth.getSession()).data.session?.access_token

    const response = await fetch('http://127.0.0.1:54321/functions/v1/handle_finder_flow', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token ?? ''}`,
            'x-tomato-edge-token': process.env.TOMATO_EDGE_TOKEN ?? ''
        },
        body: JSON.stringify({
            item_id: '40019564-e46f-4071-8a33-41c9e1b07383'
        })
    })

    const data = await response.json()

    return Response.json(data)
}
