import { useAuth } from "./AuthProvider";
import { Stack, usePathname } from "expo-router";
import { Text } from "../common/Text";
import { View } from "../View";
import tw from "twrnc";
import { AuthCard } from "./AuthCard";
import React from "react";

export function AuthGuard() {
	const auth = useAuth()
	const path = usePathname()

	return (
		auth?.user ? <>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				</Stack>
				<Text variant={'body'}>Currently at: "{path}"</Text>
				<Text variant={'body'}>Logged in as {auth.user.email}</Text>
			</>
			: <View style={tw`flex-1 justify-center items-center`}>
				<AuthCard></AuthCard>
			</View>

	)
}
