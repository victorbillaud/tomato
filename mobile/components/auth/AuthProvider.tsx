import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/gotrue-js'
import { createSupabaseClient } from "../../utils/client"
import { Alert } from "react-native";
import { Text } from "../common/Text";

interface AuthContextType {
	user: User | null
	loading: boolean
	signIn: (email: string, password: string) => Promise<void>
	sendOTP: (email: string) => Promise<boolean>
	signInWithOTP: (email: string, otp: string) => Promise<void>
	//signInWithProvider: (provider: Provider) => Promise<void>
	signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

interface AuthProviderProps {
	children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const supabase = createSupabaseClient();

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

	const InvalidCredentialsAlert = () => Alert.alert('Invalid credentials')

	return (
		<AuthContext.Provider value={{
			user,
			loading,
			signIn: async (email: string, password: string) => {
				const { data, error } = await supabase.auth.signInWithPassword({ email, password });
				if (error) {
					if (error.message === 'Invalid login credentials') {InvalidCredentialsAlert()} else {console.error(error)}
					return
				}
				setUser(data?.user ?? null);
			},
			sendOTP: async (email: string) => {
				const { data, error } = await supabase.auth.signInWithOtp({
					email,
					options: {
						shouldCreateUser: true,
					},
				});
				if (error) {
					console.error(error)
					return false
				}
				return true
			},
			signInWithOTP: async (email: string, otp: string) => {
				const { data, error } = await supabase.auth.verifyOtp({
					email,
					token: otp,
					type: 'email',
				});
				if (error) {
					console.error(error)
					return
				}
				setUser(data?.user ?? null);
			},
			/*signInWithProvider: async (provider: Provider) => {
				const {error} = await supabase.auth.signInWithOAuth({ provider })
				if (error) {
					console.error(error)
					return
				}
			},*/
			signOut: async () => {
				await supabase.auth.signOut()
				setUser(null);
			},
		}}>
			{loading ?
				<Text variant={'caption'}>Loading...</Text>
				: children
			}
		</AuthContext.Provider>
	)
}

export default AuthContext

export const useAuth = () => {
	return useContext(AuthContext)
}
