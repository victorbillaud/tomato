import { View } from "../components/View";
import { Button } from "../components/common/Button";
import { Text } from "../components/common/Text";
import tw from "../constants/tw";
import { router } from 'expo-router';

export default function NotFoundScreen() {
	return (
		<View style={tw`w-full h-full p-4 items-center justify-center gap-5`}>
			<Text variant={"h1"}>Oops!</Text>
			<Text variant={"title"}>It appears you got lost.</Text>
			<Button text={"Go to home screen"} variant={"primary"} onPress={() => router.replace('/')} />
		</View>
	)
}
