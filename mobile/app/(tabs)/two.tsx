import { Text, View } from '../../components/Themed'
import { styles } from "../../constants/Styles";
import { useAuth } from "../../components/auth/AuthProvider";
import {Button} from "react-native";
import React from "react";

export default function TabTwoScreen() {

	const {signOut} = useAuth()

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Tab Two</Text>
			<Button title={"Sign out"} onPress={() => signOut()} />
		</View>
	)
}
