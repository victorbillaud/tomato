import { Text } from "@/components/common/Text";
import { ScrollView, View } from "@/components/View";
import { useItems } from "@/components/item/ItemsProvider";
import tw from "@/constants/tw";
import Button from "@/components/common/Button";
import { useQRCodes } from "@/components/qrcode/QRCodesProvider";
import React, { useState } from "react";
import { ItemCard } from "@/components/item/ItemCard";
import { Pressable } from "react-native";
import { router } from "expo-router";

export default function ItemsTab() {
	const { items, loading: itemsLoading } = useItems()
	const { qrCodes, loading: qrCodesLoading, createQRCode } = useQRCodes()

	const [buyingQRCode, setBuyingQRCode] = useState(false)

	if (itemsLoading || qrCodesLoading)
		return <Text variant={'title'}>Loading...</Text>

	const qrCodesFree = qrCodes.filter(qrCode => !qrCode.item_id)
	return (
		<View style={tw`w-full h-full p-4 flex flex-col justify-between`}>
			{items.length === 0
				? (
					<View style={tw`h-12/13 flex flex-col items-center`}>
						<Text variant={'title'}>Nothing yet</Text>
						<Text variant={'subtitle'}>Add an item to get started</Text>
					</View>
				)
				: (
					<View style={tw`h-12/13`}>
						<ScrollView contentContainerStyle={tw`gap-3`}>
							{items.map(item => (
								<Pressable
									key={item.id}
									onPress={() => router.push({ pathname: `/item/[itemId]`, params: { itemId: item.id } })}
								>
									<ItemCard item={item} />
								</Pressable>
							))}
						</ScrollView>
					</View>
				)
			}

			<View style={tw`flex flex-row justify-end items-center gap-3`}>
				<Text variant={'subtitle'} style={tw`text-stone-500`}>{qrCodesFree.length} code{qrCodesFree.length > 1 ? 's' : ''} left</Text>
				<Button
					text={'Buy QR code'}
					variant={'secondary'}
					disabled={buyingQRCode}
					onPress={async () => {
						setBuyingQRCode(true)
						await createQRCode()
						setBuyingQRCode(false)
					}}
				/>
				<Button
					text={'Add item'}
					disabled={qrCodesFree.length === 0 || buyingQRCode}
					onPress={() => router.push({ pathname: `/item/create` })}
				/>
			</View>
		</View>
	)
}
