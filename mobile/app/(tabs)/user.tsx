import { Button } from "react-native";
import { useAuth } from "@/components/auth/AuthProvider";
import { Text } from "@/components/common/Text";
import { View } from "@/components/View";
import tw from "@/constants/tw";

export default function UserTab() {
	const { signOut } = useAuth()

	return (
		<View style={tw`w-full h-full p-4`}>
			<Text variant={"title"}>TODO: user tab</Text>
			<Button title={"Sign out"} onPress={() => signOut()} />
		</View>
	)
}
