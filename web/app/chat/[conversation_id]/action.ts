"use server"

import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleFinderRegistration(redirectUrl: string, formData: FormData) {
    const cookieStore = cookies()
    const existingCookie = cookieStore.get('conversation_tokens')?.value;
    const conversationTokens = existingCookie ? JSON.parse(existingCookie) : {};
    const email = formData.get('email') as string

    if (!email) {
        return redirect(`${redirectUrl}?error=missing email`)
    }

    const response = await fetch('http://127.0.0.1:54321/functions/v1/handle_finder_registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-tomato-edge-token': process.env.TOMATO_EDGE_TOKEN ?? '',
        },
        body: JSON.stringify({
            email,
            conversation_tokens: conversationTokens
        })
    })

    if (!response.ok) {
        return redirect(`${redirectUrl}?error=${response.statusText}`)
    }

    const user = await response.json() as User

    if (user) {
        const searchParams = new URLSearchParams()
        searchParams.append('email', email)
        searchParams.append('success', 'true')
        redirect(`${redirectUrl}?${searchParams.toString()}`)
    }
}