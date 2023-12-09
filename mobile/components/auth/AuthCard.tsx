import React, { useState } from 'react'
import { TextInput } from "react-native";
import { useAuth } from "./AuthProvider";
import { Button } from "../common/Button";
import { View } from "../View";

export function AuthCard() {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const { signIn } = useAuth();

	const handleEmailChange = (text: string) => {
		setEmail(text);
	}
	const handlePasswordChange = (text: string) => {
		setPassword(text);
	}

	return (
		<View>
			<TextInput placeholder="Email" onChangeText={handleEmailChange}></TextInput>
			<TextInput placeholder="Password" onChangeText={handlePasswordChange}></TextInput>
			<Button text={"Sign in"} onPress={() => signIn(email, password)} variant={"primary"} />
		</View>
	)
}
