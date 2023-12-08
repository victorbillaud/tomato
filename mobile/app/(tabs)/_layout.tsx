import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'

import Colors from '../../constants/Colors'
import React from "react";
import Icon from "../../components/common/Icon";

export default function TabLayout() {
	const colorScheme = useColorScheme()

	return (
		<Tabs
			screenOptions={{ tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, }}>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Tab One',
					tabBarIcon: ({ color }) => <Icon name="chevron-up" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="two"
				options={{
					title: 'Tab Two',
					tabBarIcon: ({ color }) => <Icon name="chevron-down" color={color} />,
				}}
			/>
		</Tabs>
	)
}
