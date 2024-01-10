import React from "react";
import { Stack, usePathname } from "expo-router";
import { useAuth } from "@/components/auth/AuthProvider";
import { Text } from "@/components/common/Text";
import { View } from "@/components/View";
import { AuthCard } from "@/components/auth/AuthCard";
import tw from "@/constants/tw";

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
