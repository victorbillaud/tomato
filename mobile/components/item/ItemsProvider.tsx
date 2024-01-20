import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useSupabase } from "@/components/supabase/SupabaseProvider";
import { createItem, editItem, fetchItems, Item, ItemInsert, ItemUpdate } from "@/utils/supabase/items";
import { useAuth } from "@/components/auth/AuthProvider";

interface ItemsContextType {
	items: Item[]
	loading: boolean
	createItem: ({ ...props }: ItemInsert) => Promise<Item>,
	editItem: (itemId: string, update: ItemUpdate) => Promise<Item>,
}

const ItemsContext = createContext<ItemsContextType>({
	items: [],
	loading: false,
	createItem: async () => { throw new Error('Not initialized') },
	editItem: async () => { throw new Error('Not initialized') },
})

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

	return (
		<ItemsContext.Provider value={{
			items,
			loading,
			createItem: async props => {
				const item = await createItem(supabase, props)
				setItems([...items, item])
				return item
			},
			editItem: async (itemId, update) => {
				const item = await editItem(supabase, itemId, update)
				setItems(items.map(it => it.id === itemId ? item : it))
				return item
			}
		}}>
			{props.children}
		</ItemsContext.Provider>
	)
}

export const useItems = () => useContext(ItemsContext)
