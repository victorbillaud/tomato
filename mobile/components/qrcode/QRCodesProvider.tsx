import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useSupabase } from "@/components/supabase/SupabaseProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { createQRCode, fetchQRCodes, QRCode } from "@/utils/supabase/qrcodes";

interface QRCodesContextType {
	qrCodes: QRCode[]
	loading: boolean
	createQRCode: (name?: string) => Promise<QRCode>,
}

const QRCodesContext = createContext<QRCodesContextType>({
	qrCodes: [],
	loading: false,
	createQRCode: async () => { throw new Error('Not initialized') },
})

export function QRCodesProvider({ ...props }: { children: ReactNode }) {
	const [qrCodes, setQRCodes] = useState<QRCode[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const supabase = useSupabase()
	const user = useAuth().user

	async function fetch() {
		if (!user) {
			setQRCodes([])
			return
		}
		setLoading(true)
		try {
			setQRCodes(await fetchQRCodes(supabase))
		} catch (error) {
			setQRCodes([])
			console.error(error)
		}
		setLoading(false)
	}

	useEffect(() => { fetch() }, [user])

	return (
		<QRCodesContext.Provider value={{
			qrCodes,
			loading,
			createQRCode: async (name) => {
				const qrCode = await createQRCode(supabase, user!.id, name)
				qrCodes.push(qrCode)
				return qrCode
			},
		}}>
			{props.children}
		</QRCodesContext.Provider>
	)
}

export const useQRCodes = () => useContext(QRCodesContext)
