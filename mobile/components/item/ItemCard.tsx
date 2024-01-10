import { Item } from "@/utils/supabase/items";
import { View } from "@/components/View";
import { Text } from "@/components/common/Text";
import tw from "@/constants/tw";
import { IconAlertOctagon, IconDiscountCheck } from "tabler-icons-react-native";
import { Icon } from "@/components/common/Icon";
import { DateTime } from "luxon";

interface Props {
	item: Item
}

export function ItemCard(props: Props) {
	const status = props.item.lost ? ITEM_STATUS_LOST : !props.item.activated ? ITEM_STATUS_NOT_ACTIVATED : null

	return (
		<View style={tw`p-2 flex flex-col bg-stone-100 rounded border border-stone-300`}>

			<View style={tw`flex flex-row justify-between bg-stone-100`}>
				<Text variant={'title'}>{props.item.name}</Text>
				{status && (
					<View style={tw`flex flex-row items-center justify-center gap-1 bg-stone-100`}>
						<Text variant={'subtitle'} style={tw`text-${status.color}`}>{status.text}</Text>
						<Icon icon={status.icon} color={status.color} />
					</View>
				)}
			</View>

			<View style={tw`mt-2 flex flex-row justify-between bg-stone-100`}>
				<View style={tw`flex flex-col bg-stone-100`}>
					<Text variant={'overline'}>Description</Text>
					<Text variant={'body'}>{props.item.description}</Text>
				</View>
				<View style={tw`w-1/3 flex flex-col bg-stone-100 items-end`}>
					<Text variant={'overline'}>Created at</Text>
					<Text variant={'body'}>{DateTime.fromISO(props.item.created_at).toFormat('MMM. dd, yyyy')}</Text>
				</View>
			</View>

		</View>
	)
}

const ITEM_STATUS_LOST = {
	text: 'Item lost',
	color: 'red-600',
	icon: IconAlertOctagon
}

const ITEM_STATUS_NOT_ACTIVATED = {
	text: 'Not activated',
	color: 'orange-500',
	icon: IconDiscountCheck
}
