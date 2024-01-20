import { Item } from "@/utils/supabase/items";
import { View } from "@/components/View";
import { Text } from "@/components/common/Text";
import tw from "@/constants/tw";
import { Icon } from "@/components/common/Icon";
import { DateTime } from "luxon";
import { ITEM_STATUS_LOST, ITEM_STATUS_NOT_ACTIVATED } from "@/components/item/ItemUtils";

interface Props {
	item: Item
}

export function ItemCard(props: Props) {
	const status = props.item.lost ? ITEM_STATUS_LOST : !props.item.activated ? ITEM_STATUS_NOT_ACTIVATED : null
	const backgroundStyle = status?.backgroundColor ? tw`bg-${status.backgroundColor}` : tw`bg-stone-100`

	return (
		<View style={[tw`p-2 flex flex-col rounded border border-stone-300`, backgroundStyle]}>

			{/* -------------------- TITLE & STATUS -------------------- */}
			<View style={[tw`flex flex-row justify-between`, backgroundStyle]}>
				<View style={[tw`${status ? 'w-2/3' : 'w-full'}`, backgroundStyle]}>
					<Text variant={'title'}>{props.item.name}</Text>
				</View>
				{status && (
					<View style={[tw`w-1/3 flex flex-row items-center justify-end gap-1`, backgroundStyle]}>
						<Text variant={'subtitle'} style={tw`text-${status.color}`}>{status.text}</Text>
						<Icon icon={status.icon} color={status.color} />
					</View>
				)}
			</View>

			<View style={[tw`mt-2 flex flex-row justify-between`, backgroundStyle]}>
				{/* -------------------- DESCRIPTION -------------------- */}
				<View style={[tw`w-2/3 flex flex-col`, backgroundStyle]}>
					<Text variant={'overline'}>Description</Text>
					<Text variant={'body'}>
						{props.item.description ?? '-'}
					</Text>
				</View>

				{/* -------------------- CREATED DATE -------------------- */}
				<View style={[tw`w-1/3 flex flex-col items-end`, backgroundStyle]}>
					<Text variant={'overline'}>Created</Text>
					<Text variant={'body'}>
						{DateTime.fromISO(props.item.created_at).toFormat('MMM. dd, yyyy')}
					</Text>
				</View>
			</View>

		</View>
	)
}
