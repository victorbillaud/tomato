import { Text } from "@/components/common/Text";
import { View } from "@/components/View";
import tw from "@/constants/tw";
import { useItems } from "@/components/item/ItemsProvider";

export default function ItemsTab() {
	const { items, loading } = useItems()

	console.log('--------- ItemsTab')
	console.log(items)
	console.log('loading')

	if (loading)
		return <Text variant={'title'}>Loading...</Text>

	return (
		<View style={tw`w-full h-full p-4`}>
			<Text variant={"title"}>TODO: items tab</Text>
			<Text variant={"body"}>{items?.length ?? 0}</Text>
		</View>
	)
}
