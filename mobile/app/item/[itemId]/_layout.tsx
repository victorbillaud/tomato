import { View } from "@/components/View";
import { Text } from "@/components/common/Text";
import { useItems } from "@/components/item/ItemsProvider";
import NotFoundScreen from "@/app/[...missing]";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";

export default function ItemPage() {
	const itemId = useLocalSearchParams()['itemId']
	const navigation = useNavigation()
	const { items, loading: itemsLoading } = useItems()
	
	const item = items.find(item => item.id === itemId)

	useLayoutEffect(() => {
		navigation.setOptions({ title: item?.name ?? 'Item' })
	}, [item])

	if (itemsLoading)
		return <Text variant={'title'}>Loading...</Text>

	if (item === undefined)
		return <NotFoundScreen />

	return (
		<View>
			<Text variant={"h1"}>Item {item.name}</Text>
		</View>
	)
}
