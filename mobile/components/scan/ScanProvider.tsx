import React, { createContext, ReactNode, useContext } from 'react'
import { useSupabase } from "@/components/supabase/SupabaseProvider";
import { fetchScans, Scan } from "@/utils/supabase/scans";

interface ScansContextType {
	fetchScans: (itemId: string) => Promise<Scan[]>,
}

const ScansContext = createContext<ScansContextType>({
	fetchScans: async () => { throw new Error('Not initialized') },
})

export function ScansProvider(props: { children: ReactNode }) {
	const supabase = useSupabase()

	return (
		<ScansContext.Provider value={{
			fetchScans: itemId => fetchScans(supabase, itemId),
		}}>
			{props.children}
		</ScansContext.Provider>
	)
}

export const useScans = () => useContext(ScansContext)
