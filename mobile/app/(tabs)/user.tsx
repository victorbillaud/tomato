import { View } from '../../components/Themed'
import { useAuth } from "../../components/auth/AuthProvider";
import { Button } from "react-native";
import { Text } from "../../components/common/Text";
import tw from "../../constants/tw";

export default function UserTab() {
	const { signOut } = useAuth()

	return (
		<View style={tw`w-full h-full p-4`}>
			<Text variant={"title"}>TODO: user tab</Text>
			<Button title={"Sign out"} onPress={() => signOut()} />
		</View>
	)
}
