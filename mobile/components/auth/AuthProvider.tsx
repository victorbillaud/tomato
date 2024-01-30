import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { AuthError, User } from '@supabase/gotrue-js'
import { Text } from "@/components/common/Text";
import { useSupabase } from "@/components/supabase/SupabaseProvider";
import { editProfile, fetchProfile, UserProfile, UserProfileUpdate } from "@/utils/supabase/user";

interface AuthContextType {
	user: User | null
	userProfile: UserProfile | null
	loading: boolean
	signIn: (email: string, password: string) => Promise<AuthError | null>
	sendOTP: (email: string) => Promise<AuthError | null>
	signInWithOTP: (email: string, otp: string) => Promise<AuthError | null>
	updateProfile: (update: UserProfileUpdate) => Promise<void>
	signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

interface Props {
	children: ReactNode
}

export function AuthProvider(props: Props) {
	const [user, setUser] = useState<User | null>(null)
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const supabase = useSupabase()

	useEffect(() => {
		// initial fetch of session
		const checkUser = async () => {
			setLoading(true)
			const session = await supabase.auth.getSession()
			setUser(session.data.session?.user ?? null)
			setUserProfile(await fetchProfile(supabase))
			setLoading(false)
		}
		checkUser().catch(console.error)

		// update provider when auth state changes
		const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
			setUser(session?.user ?? null)
			setUserProfile(session?.user ? await fetchProfile(supabase) : null)
		})

		// cleanup on component destroy
		return () => { listener.subscription?.unsubscribe() }
	}, [])

	return (
		<AuthContext.Provider value={{
			user,
			userProfile,
			loading,
			async signIn(email: string, password: string): Promise<AuthError | null> {
				const { data, error } = await supabase.auth.signInWithPassword({ email, password })
				if (error)
					console.error(error)
				else {
					setUser(data?.user ?? null)
					setUserProfile(data?.user ? await fetchProfile(supabase) : null)
				}
				return error
			},
			async sendOTP(email: string): Promise<AuthError | null> {
				const { error } = await supabase.auth.signInWithOtp({
					email,
					options: {
						shouldCreateUser: true,
					},
				})
				if (error) console.error(error)
				return error
			},
			async signInWithOTP(email: string, otp: string): Promise<AuthError | null> {
				const { data, error } = await supabase.auth.verifyOtp({
					email,
					token: otp,
					type: 'email',
				})
				if (error)
					console.error(error)
				else {
					setUser(data?.user ?? null)
					setUserProfile(data?.user ? await fetchProfile(supabase) : null)
					console.log(data?.user)
					console.log(await fetchProfile(supabase))
				}
				return error
			},
			async updateProfile(update: UserProfileUpdate) {
				setUserProfile(await editProfile(supabase, update))
			},
			async signOut() {
				const error = await supabase.auth.signOut()
				if (error) console.error(error)
				setUser(null)
				setUserProfile(null)
			}
		}}>
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
