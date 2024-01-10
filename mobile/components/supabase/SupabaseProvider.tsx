import React, { createContext, ReactNode, useContext } from 'react'
import { createSupabaseClient } from "@/utils/client"

const supabase = createSupabaseClient()
const SupabaseContext = createContext(supabase)

interface Props {
	children: ReactNode
}

export function SupabaseProvider(props: Props) {
	return (
		<SupabaseContext.Provider value={supabase}>
			{props.children}
		</SupabaseContext.Provider>
	)
}

export const useSupabase = () => {
	return useContext(SupabaseContext)
}
