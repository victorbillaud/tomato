import { View } from "@/components/View";
import { Text } from "@/components/common/Text";
import { useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import Button from "@/components/common/Button";
import { useQRCodes } from "@/components/qrcode/QRCodesProvider";
import { InputText } from "@/components/common/InputText";
import { QRCode } from "@/utils/supabase/qrcodes";
import tw from "@/constants/tw";
import Select from "@/components/common/Select";
import { useItems } from "@/components/item/ItemsProvider";

export default function CreateItemPage() {
	const navigation = useNavigation()
	const { loading: itemsLoading, createItem } = useItems()
	const { qrCodes, loading: qrCodesLoading, refreshQRCodes } = useQRCodes()

	const [qrCode, setQRCode] = useState<QRCode>()
	const [name, setName] = useState<string>()
	const [description, setDescription] = useState<string>()
	const [creating, setCreating] = useState(false)

	useLayoutEffect(() => {
		navigation.setOptions({ title: 'Add an item' })
	}, [])

	if (itemsLoading || qrCodesLoading)
		return <Text variant={'title'}>Loading...</Text>

	const qrCodesFree = qrCodes.filter(qrCode => !qrCode.item_id)
	return (
		<View style={tw`p-4 gap-4`}>
			<Text variant={'title'}>Select a QR code</Text>
			<Select<QRCode>
				disabled={creating}
				options={qrCodesFree.map(qrCode => ({ label: qrCode.name, value: qrCode }))}
				onChange={qrCode => setQRCode(qrCode)}
			/>

			<Text variant={'title'}>Your item</Text>
			<InputText
				disabled={creating}
				labelText={"Name"}
				placeholder="My bag"
				onChangeText={text => setName(text)}
			/>
			<InputText
				disabled={creating}
				labelText={"Description"}
				multiline={true}
				placeholder="My bag"
				onChangeText={text => setDescription(text)}
			/>

			<Button
				text={'Add item'}
				disabled={!qrCode || !name || creating}
				onPress={async () => {
					setCreating(true)
					await createItem({ qrcode_id: qrCode!!.id, name: name!!, description })
					await refreshQRCodes()
					setCreating(false)
					navigation.goBack()
				}}
			/>
		</View>
	)
}
