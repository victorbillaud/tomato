import { Text } from "@/components/common/Text";
import { ScrollView, View } from "@/components/View";
import { useItems } from "@/components/item/ItemsProvider";
import { ItemCard } from "@/components/item/ItemCard";
import tw from "@/constants/tw";

export default function ItemsTab() {
	const { items, loading } = useItems()

	if (loading)
		return <Text variant={'title'}>Loading...</Text>

	return (
		<View style={tw`w-full h-full p-4`}>
			<ScrollView contentContainerStyle={tw`gap-4`}>
				{items.map(item => <ItemCard key={item.id} item={item} />)}
			</ScrollView>
		</View>
	)
}
