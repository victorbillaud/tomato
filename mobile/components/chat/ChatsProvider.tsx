import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useSupabase } from "@/components/supabase/SupabaseProvider";
import { getItem } from "@/utils/supabase/items";
import {User} from "@supabase/supabase-js";
import {listUserConversations, TConversationWithLastMessage} from "@/utils/supabase/messaging";
import {getUserDetails} from "@/utils/supabase/user";
import { useAuth } from "@/components/auth/AuthProvider";
import {Database} from "@/utils/supabase/supabase_types";

interface ChatsContextType {
    conversationCards: ChatCardContent[]
    loading: boolean
}

const ChatsContext = createContext<ChatsContextType>({ conversationCards: [], loading: false })

export function ChatsProvider({ ...props }: { children: ReactNode }) {
    const [conversationCards, setConversationCards] = useState<ChatCardContent[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const supabase = useSupabase()
    const user = useAuth().user

    useEffect(() => {
        const init = async () => {
            setLoading(true)
            try {
                let cards : ChatCardContent[] = []
                let conversations = await listUserConversations(supabase)
                for (const conversation of conversations) {
                    let isOwner = conversation.owner_id === user?.id;
                    let itemId = conversation.item_id;
                    let conv = conversation
                    const { user: userDetailsFetched, error: avatarError } =
                        await getUserDetails(supabase, isOwner ? conversation.finder_id : conversation.owner_id);
                    const { data: item, error: itemError } =
                        await getItem(supabase, itemId);
                    cards.push({conversation : conv, otherUser: userDetailsFetched, itemInfo: item as DBItem})
                }
                setConversationCards(cards)
            } catch (error) {
                setConversationCards([])
                console.error(error)
            }
            setLoading(false)
        }
        if (user)
            init()
    }, [user])

    return <ChatsContext.Provider value={{ conversationCards, loading }}>{props.children}</ChatsContext.Provider>
}

export type DBMessage = Database['public']['Tables']['message']['Row'];

export type DBProfile = Database['public']['Tables']['profiles']['Row'];

export type DBItem = Database['public']['Tables']['item']['Row'];

export type ChatCardContent = {
    conversation: TConversationWithLastMessage;
    otherUser: DBProfile | null;
    itemInfo: DBItem | null;
}

export const useChats = () => useContext(ChatsContext)
