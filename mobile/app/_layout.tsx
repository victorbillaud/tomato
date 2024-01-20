import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { ItemsProvider } from "@/components/item/ItemsProvider";
import { QRCodesProvider } from "@/components/qrcode/QRCodesProvider";
import { View } from "@/components/View";
import tw from "@/constants/tw";
import { AuthCard } from "@/components/auth/AuthCard";
import { ScansProvider } from "@/components/scan/ScanProvider";

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
				<ItemsProvider>
					<QRCodesProvider>
						<ScansProvider>
							<AuthGuard />
						</ScansProvider>
					</QRCodesProvider>
				</ItemsProvider>
			</AuthProvider>
		</ThemeProvider>
	)
}

function AuthGuard() {
	const auth = useAuth()
	return auth?.user
		? (
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack>
		)
		: (
			<View style={tw`flex-1 justify-center items-center`}>
				<AuthCard />
			</View>
		)

}
