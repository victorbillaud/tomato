import { useState } from 'react'
import { IconArrowLeft } from "tabler-icons-react-native";
import { Button } from "@/components/common/Button"
import { InputText } from "@/components/common/InputText"
import { Text } from "@/components/common/Text"
import { View } from "@/components/View"
import { useAuth } from "@/components/auth/AuthProvider";
import tw from "@/constants/tw"
import { Alert } from "react-native";

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
								const error = await auth.sendOTP(email)
								if (!error)
									setLoginType('otp')
								else
									Alert.alert("Could not send OTP", error.message)
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
								onPress={async () => {
									const error = await auth.signInWithOTP(email, otp)
									if (error)
										Alert.alert("Could not sign in", error.message)
								}}
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
								onPress={async () => {
									const error = await auth.signIn(email, password)
									if (error)
										Alert.alert("Could not sign in", error.message)
								}}
						/>
					</View>
				</>
			}
		</View>
	)
}
