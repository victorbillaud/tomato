import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack, usePathname } from 'expo-router'
import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { Text } from "../components/Themed";

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
	const path = usePathname()

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack>
			<Text>Currently at: "{path}"</Text>
		</ThemeProvider>
	)
}
