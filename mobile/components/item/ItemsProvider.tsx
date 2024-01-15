import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useSupabase } from "@/components/supabase/SupabaseProvider";
import { fetchItems, Item } from "@/utils/supabase/items";
import { useAuth } from "@/components/auth/AuthProvider";

interface ItemsContextType {
	items: Item[]
	loading: boolean
}

const ItemsContext = createContext<ItemsContextType>({ items: [], loading: false })

export function ItemsProvider({ ...props }: { children: ReactNode }) {
	const [items, setItems] = useState<Item[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const supabase = useSupabase()
	const user = useAuth().user

	useEffect(() => {
		const init = async () => {
			setLoading(true)
			try {
				setItems(await fetchItems(supabase))
			} catch (error) {
				setItems([])
				console.error(error)
			}
			setLoading(false)
		}
		if (user)
			init()
	}, [user])

	return <ItemsContext.Provider value={{ items, loading }}>{props.children}</ItemsContext.Provider>
}

export const useItems = () => useContext(ItemsContext)
