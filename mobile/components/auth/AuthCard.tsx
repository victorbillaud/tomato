import { useState } from 'react'
import { useAuth } from "./AuthProvider"
import { Button } from "../common/Button"
import { InputText } from "../common/InputText"
import { Text } from "../common/Text"
import { View } from "../View"
import tw from "../../constants/tw"
import { IconArrowLeft } from "tabler-icons-react-native";

export function AuthCard() {
	const auth = useAuth()

	const [loginType, setLoginType] = useState<'password' | 'otp' | undefined>(undefined)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [otp, setOTP] = useState('')
	const [sendingOTP, setSendingOTP] = useState(false)

	return (
		<View style={tw`w-3/4 flex gap-5 items-center`}>
			<Text variant={"h1"}>Sign in</Text>

			{/* -------------------- EMAIL -------------------- */}
			<InputText labelText={"E-mail"}
					   placeholder="user@email.com"
					   onChangeText={text => setEmail(text)}
			/>

			{/* -------------------- SELECT LOGIN TYPE -------------------- */}
			{loginType === undefined &&
				<View style={tw`flex gap-1`}>
					<Button text={"Sign in with OTP"}
							variant={"primary"}
							disabled={sendingOTP || !email}
							isLoader={sendingOTP}
							onPress={async () => {
								setSendingOTP(true)
								const success = await auth.sendOTP(email)
								if (success)
									setLoginType('otp')
								setSendingOTP(false)
							}}
					/>
					<Button text={"Sign in with password"}
							variant={"secondary"}
							disabled={sendingOTP || !email}
							onPress={() => setLoginType('password')}
					/>
				</View>
			}

			{/* -------------------- OTP LOGIN -------------------- */}
			{loginType === 'otp' &&
				<>
					<Text variant={"body"}>Check your inbox for your one-time password.</Text>
					<InputText labelText={"One-time password"}
							   placeholder="123456"
							   onChangeText={text => setOTP(text)}
					/>
					<View style={tw`w-full flex flex-row justify-between`}>
						<Button text={"Cancel"}
								variant={"secondary"}
								icon={{ icon: IconArrowLeft }}
								onPress={() => setLoginType(undefined)}
						/>
						<Button text={"Sign in"}
								variant={"primary"}
								disabled={!email || !otp}
								onPress={() => auth.signInWithOTP(email, otp)}
						/>
					</View>
				</>
			}

			{/* -------------------- PASSWORD LOGIN -------------------- */}
			{loginType === 'password' &&
				<>
					<InputText labelText={"Password"}
							   placeholder="********"
							   password={true}
							   onChangeText={text => setPassword(text)}
					/>
					<View style={tw`w-full flex flex-row justify-between`}>
						<Button text={"Cancel"}
								variant={"secondary"}
								icon={{ icon: IconArrowLeft }}
								onPress={() => setLoginType(undefined)}
						/>
						<Button text={"Sign in"}
								variant={"primary"}
								disabled={!email || !password}
								onPress={() => auth.signIn(email, password)}
						/>
					</View>
				</>
			}
		</View>
	)
}
