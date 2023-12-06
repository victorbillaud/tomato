import { createClient } from "@/utils/supabase/server"
import { Database } from "@utils/lib/supabase/supabase_types"
import { cookies } from "next/headers"

type SignInResponseReturnType = {
    item: Database["public"]["Tables"]["item"]["Row"]
    conversation: Database["public"]["Tables"]["conversation"]["Row"]
}

type AnonymousResponseReturnType = {
    conversation_id: string
    token: string
}

type ResponseReturnType = SignInResponseReturnType | AnonymousResponseReturnType

export async function GET(request: Request) {

    const cookieStore = cookies()
    const supabaseClient = createClient(cookieStore)

    const token = (await supabaseClient.auth.getSession()).data.session?.access_token

    const response = await fetch('http://127.0.0.1:54321/functions/v1/handle_finder_flow', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token ?? ''}`,
            'x-tomato-edge-token': process.env.TOMATO_EDGE_TOKEN ?? '',
            'x-tomato-conversation-token': cookieStore.get('conversation_token')?.value ?? ''
        },
        body: JSON.stringify({
            item_id: '40019564-e46f-4071-8a33-41c9e1b07383'
        })
    })

    if (!response.ok) {
        console.error(await response.json())
        return new Response('Error', { status: 500 })
    }

    const data: ResponseReturnType = await response.json()
    if ('token' in data && 'conversation_id' in data) {
        cookies().set('conversation_token', data.token, { path: '/' })
    }

    return Response.json(data)
}
