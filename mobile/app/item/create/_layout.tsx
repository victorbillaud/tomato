import { View } from "@/components/View";
import { Text } from "@/components/common/Text";
import { useItems } from "@/components/item/ItemsProvider";
import { useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import Button from "@/components/common/Button";

export default function CreateItemPage() {
	const navigation = useNavigation()
	const { items, loading: itemsLoading } = useItems()

	useLayoutEffect(() => {
		navigation.setOptions({ title: 'Add an item' })
	}, [])

	if (itemsLoading)
		return <Text variant={'title'}>Loading...</Text>

	return (
		<View>
			<Text variant={'title'}>TODO</Text>
			<Button
				text={'Add item'}
				onPress={() => { }}
			/>
		</View>
	)
}
