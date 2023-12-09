import { useState } from 'react'
import { useAuth } from "./AuthProvider"
import { Button } from "../common/Button"
import { InputText } from "../common/InputText"
import { Text } from "../common/Text"
import { View } from "../View"
import tw from "../../constants/tw"

export function AuthCard() {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const { signIn } = useAuth()

	const handleEmailChange = (text: string) => { setEmail(text) }
	const handlePasswordChange = (text: string) => { setPassword(text) }

	return (
		<View style={tw`w-3/4 flex gap-5 items-center`}>
			<Text variant={"h1"}>Sign in</Text>
			<InputText labelText={"E-mail"}
					   placeholder="user@email.com"
					   onChangeText={handleEmailChange}
			/>
			<InputText labelText={"Password"}
					   placeholder="********"
					   onChangeText={handlePasswordChange}
					   password={true}
			/>
			<Button text={"Sign in with password"}
					variant={"primary"}
					onPress={() => signIn(email, password)}
			/>
						disabled={!email || !password}
		</View>
	)
}
