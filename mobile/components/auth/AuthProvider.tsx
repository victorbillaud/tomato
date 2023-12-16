import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/gotrue-js'
import { Alert } from "react-native";
import { Text } from "@/components/common/Text";
import { useSupabase } from "@/components/supabase/SupabaseProvider";

interface AuthContextType {
	user: User | null
	loading: boolean
	signIn: (email: string, password: string) => Promise<boolean>
	sendOTP: (email: string) => Promise<boolean>
	signInWithOTP: (email: string, otp: string) => Promise<boolean>
	signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

interface Props {
	children: ReactNode
}

export function AuthProvider(props: Props) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const supabase = useSupabase()

	useEffect(() => {
		// initial fetch of session
		const checkUser = async () => {
			setLoading(true)
			const session = await supabase.auth.getSession()
			setUser(session.data.session?.user ?? null)
			setLoading(false)
		}
		checkUser().catch(console.error)

		// update provider when auth state changes
		const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
			setUser(session?.user ?? null)
		})

		// cleanup on component destroy
		return () => { listener.subscription?.unsubscribe() }
	}, [])

	async function signIn(email: string, password: string): Promise<boolean> {
		const { data, error } = await supabase.auth.signInWithPassword({ email, password })
		if (error) {
			if (error.message === 'Invalid login credentials') {InvalidCredentialsAlert()} else {console.error(error)}
			return false
		}
		setUser(data?.user ?? null)
		return true
	}

	async function sendOTP(email: string): Promise<boolean> {
		const { data, error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				shouldCreateUser: true,
			},
		})
		if (error) console.error(error)
		return !error
	}

	async function signInWithOTP(email: string, otp: string): Promise<boolean> {
		const { data, error } = await supabase.auth.verifyOtp({
			email,
			token: otp,
			type: 'email',
		})
		if (error) {
			console.error(error)
			return false
		}
		setUser(data?.user ?? null)
		return true
	}

	async function signOut(): Promise<void> {
		const error = await supabase.auth.signOut()
		if (error) console.error(error)
		setUser(null)
	}

	const InvalidCredentialsAlert = () => Alert.alert('Invalid credentials')

	return (
		<AuthContext.Provider value={{ user, loading, signIn, sendOTP, signInWithOTP, signOut, }}>
			{loading ?
				<Text variant={'caption'}>Loading...</Text>
				: props.children
			}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext)
}
