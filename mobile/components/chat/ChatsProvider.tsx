import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useSupabase } from "@/components/supabase/SupabaseProvider";
import { fetchItems, Item } from "@/utils/supabase/items";
import {User} from "@supabase/supabase-js";
import {listUserConversations, TConversationWithLastMessage} from "@/utils/supabase/messaging";
import { useAuth } from "@/components/auth/AuthProvider";

interface ChatsContextType {
    conversations: TConversationWithLastMessage[]
    loading: boolean
}

const ChatsContext = createContext<ChatsContextType>({ conversations: [], loading: false })

export function ChatsProvider({ ...props }: { children: ReactNode }) {
    const [conversations, setConversations] = useState<TConversationWithLastMessage[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const supabase = useSupabase()
    const user = useAuth().user

    useEffect(() => {
        const init = async () => {
            setLoading(true)
            try {
                setConversations(await listUserConversations(supabase))
            } catch (error) {
                setConversations([])
                console.error(error)
            }
            setLoading(false)
        }
        if (user)
            init()
    }, [user])

    return <ChatsContext.Provider value={{ conversations, loading }}>{props.children}</ChatsContext.Provider>
}

export const useChats = () => useContext(ChatsContext)
