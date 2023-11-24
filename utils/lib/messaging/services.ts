import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../supabase/supabase_types";

export async function listUserConversations(
    supabaseInstance: SupabaseClient<Database>,
) {
    const { data: { user } } = await supabaseInstance.auth.getUser();

    const { data, error } = await supabaseInstance
        .rpc("get_user_conversations_with_last_message", {
            user_id: user.id,
        })

    return { data, error }
}

export async function insertConversation(
    supabaseInstance: SupabaseClient<Database>,
    conversation: Pick<Database["public"]["Tables"]["conversation"]["Insert"], "finder_id" | "item_id">
) {

    const { data: { user } } = await supabaseInstance.auth.getUser();

    const conversationToInsert: Database["public"]["Tables"]["conversation"]["Insert"] = {
        ...conversation,
        owner_id: user.id,
    }

    const { data: insertedConversation, error } = await supabaseInstance
        .from("conversation")
        .insert(conversationToInsert)
        .select("*")
        .single()

    return { insertedConversation, error }
}

export async function insertMessage(
    supabaseInstance: SupabaseClient<Database>,
    message: Database["public"]["Tables"]["message"]["Insert"]
) {

    const { data: { user: sender } } = await supabaseInstance.auth.getUser();

    const messageToInsert: Database["public"]["Tables"]["message"]["Insert"] = {
        ...message,
        sender_id: sender.id,
    }

    const { data: insertedMessage, error } = await supabaseInstance
        .from("message")
        .insert(messageToInsert)
        .select("*")
        .single()

    return { insertedMessage, error }
}
