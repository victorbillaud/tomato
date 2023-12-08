import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack, usePathname } from 'expo-router'
import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import {Text, View} from "../components/Themed";
import { AuthProvider, useAuth } from "../components/auth/AuthProvider";
import {styles} from "../constants/Styles";
import tw from 'twrnc';
import {AuthCard} from "../components/auth/AuthCard";

export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()  // prevent the splash screen from auto-hiding before asset loading is complete

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	})

	useEffect(() => {
		if (error) throw error
	}, [error])

	useEffect(() => {
		if (loaded)
			SplashScreen.hideAsync()
	}, [loaded])

	if (!loaded)
		return null

	return <RootLayoutNav />
}

export const unstable_settings = {  // router configuration
	initialRouteName: '(tabs)',
}

function RootLayoutNav() {
	const colorScheme = useColorScheme()

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<AuthProvider>
				<AuthGuard />
			</AuthProvider>
		</ThemeProvider>
	)
}

function AuthGuard() {
	const auth = useAuth()
	const path = usePathname()

	console.log('auth guard', auth)

	return (
		auth?.user ?
			<>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				</Stack>
				<Text>Currently at: "{path}"</Text>
				<Text>Logged in as {auth.user.email}</Text>
			</>
			: <View style={tw`flex-1 justify-center items-center`}>
				<AuthCard></AuthCard>
			 </View>

	)
}
