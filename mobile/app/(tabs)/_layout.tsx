import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { textConfig } from "../../components/common/Text";
import { Icon } from "../../components/common/Icon";
import Colors from '../../constants/Colors'

export default function TabLayout() {
	const colorScheme = useColorScheme()

	return (
		<Tabs screenOptions={{ tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint }}>
			{/* -------------------- ITEMS -------------------- */}
			<Tabs.Screen
				name="index"
				options={{
					tabBarIcon: ({ color }) => <Icon name="list-details" color={color} />,
					tabBarShowLabel: false,
					title: 'Items',
					headerTitleStyle: [textConfig.h1]
				}}
			/>

			{/* -------------------- CHATS -------------------- */}
			<Tabs.Screen
				name="chats"
				options={{
					tabBarIcon: ({ color }) => <Icon name="messages" color={color} />,
					tabBarShowLabel: false,
					title: 'Chats',
					headerTitleStyle: [textConfig.h1]
				}}
			/>

			{/* -------------------- USER -------------------- */}
			<Tabs.Screen
				name="user"
				options={{
					tabBarIcon: ({ color }) => <Icon name="user" color={color} />,
					tabBarShowLabel: false,
					title: 'User',
					headerTitleStyle: [textConfig.h1]
				}}
			/>
		</Tabs>
	)
}
