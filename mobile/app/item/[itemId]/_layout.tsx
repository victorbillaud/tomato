import { ScrollView, View } from "@/components/View";
import { Text } from "@/components/common/Text";
import { useItems } from "@/components/item/ItemsProvider";
import NotFoundScreen from "@/app/[...missing]";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import tw from "@/constants/tw";
import { Icon } from "@/components/common/Icon";
import { ITEM_STATUS_LOST, ITEM_STATUS_NOT_ACTIVATED } from "@/components/item/ItemUtils";
import { DateTime } from "luxon";
import Switch from "@/components/common/Switch";
import Button from "@/components/common/Button";
import { useScans } from "@/components/scan/ScanProvider";
import { Scan } from "@/utils/supabase/scans";
import { useQRCodes } from "@/components/qrcode/QRCodesProvider";
import { IconUpload } from "tabler-icons-react-native";
import { Share } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function ItemPage() {
	const itemId = useLocalSearchParams()['itemId']
	const navigation = useNavigation()

	const { qrCodes, loading: qrCodesLoading } = useQRCodes()
	const { items, loading: itemsLoading, editItem } = useItems()
	const { fetchScans } = useScans()

	const [scans, setScans] = useState<Scan[]>()
	const [itemQRCodeRef, setItemQRCodeRef] = useState<any>()
	const [updating, setUpdating] = useState(false)

	const item = items.find(item => item.id === itemId)
	const itemStatus = item?.lost ? ITEM_STATUS_LOST : !item?.activated ? ITEM_STATUS_NOT_ACTIVATED : null
	const backgroundStyle = undefined  //status?.backgroundColor ? tw`bg-${status.backgroundColor}` : undefined

	useLayoutEffect(() => {
		navigation.setOptions({
			title: item?.name ?? 'Item',
			headerStyle: backgroundStyle,
		})
	}, [item])

	useEffect(() => {
		if (item?.qrcode_id) {
			fetchScans(item.id).then(setScans)
		} else
			setScans([])
	}, [item])

	if (itemsLoading || qrCodesLoading) return <Text variant={'title'}>Loading...</Text>
	if (item === undefined) return <NotFoundScreen />

	const itemQRCode = qrCodes.find(qrCode => qrCode.id === item.qrcode_id)
	const sortedScans = scans?.sort((a, b) => a.created_at > b.created_at ? -1 : 1)

	return (
		<View style={[tw`h-full`, backgroundStyle]}>
			<View style={[tw`h-12/13 p-4 flex flex-col gap-5`, backgroundStyle]}>
				{/* -------------------- STATUS -------------------- */}
				{itemStatus && (
					<View style={[tw`flex flex-col gap-1 items-center text-center`, backgroundStyle]}>
						<View style={[tw`flex flex-row items-center justify-center gap-1`, backgroundStyle]}>
							<Text variant={'subtitle'} style={tw`text-${itemStatus.color}`}>{itemStatus.text}</Text>
							<Icon icon={itemStatus.icon} color={itemStatus.color} />
						</View>
						<Text variant={'body'} style={tw`text-${itemStatus.color}`}>{itemStatus.description}</Text>
					</View>
				)}

				<View style={[tw`flex flex-row justify-between gap-3`, backgroundStyle]}>
					<View style={[tw`${itemQRCode ? 'w-6/10' : 'w-full'} flex flex-col gap-5`, backgroundStyle]}>
						{/* -------------------- DESCRIPTION -------------------- */}
						<View style={[tw`flex flex-col gap-1`, backgroundStyle]}>
							<Text variant={'overline'}>Description</Text>
							<Text variant={'body'} style={tw`ml-1`}>
								{item.description ?? '-'}
							</Text>
						</View>

						{/* -------------------- CREATED DATE -------------------- */}
						<View style={[tw`flex flex-col gap-1`, backgroundStyle]}>
							<Text variant={'overline'}>Created</Text>
							<Text variant={'body'} style={tw`ml-1`}>
								{DateTime.fromISO(item.created_at).toFormat(`MMM. dd, yyyy 'at' HH:MM`)}
							</Text>
						</View>

						{/* -------------------- LOST DATE -------------------- */}
						{item.lost && (
							<View style={[tw`flex flex-col gap-1`, backgroundStyle]}>
								<Text variant={'overline'} style={tw`text-red-600`}>Lost</Text>
								<Text variant={'body'} style={tw`ml-1 text-red-600`}>
									{DateTime.fromISO(item.lost_at!!).toFormat(`MMM. dd, yyyy 'at' HH:MM`)}
								</Text>
							</View>
						)}

						{/* -------------------- SETTINGS -------------------- */}
						<View style={[tw`flex flex-col gap-1`, backgroundStyle]}>
							<Text variant={'overline'}>Settings</Text>
							<Switch
								text={'Always notify me on scan'}
								size={'small'}
								disabled={updating}
								default={item.notify_anyway}
								style={backgroundStyle}
								onChange={async value => {
									setUpdating(true)
									try {
										await editItem(item.id, { notify_anyway: value })
									} catch (e) {
										console.error(e)
									}
									setUpdating(false)
								}}
							/>
						</View>
					</View>

					{/* -------------------- QR CODE -------------------- */}
					{itemQRCode && (
						<View style={[tw`w-3/10 flex flex-col items-end gap-1`, backgroundStyle]}>
							<View style={[tw`w-full flex flex-col items-center gap-1`, backgroundStyle]}>
								<Text
									variant={'caption'}
									style={tw`p-1 text-center capitalize bg-blue-200 text-blue-500 `}
								>
									{itemQRCode.name}
								</Text>
								<QRCode
									value={itemQRCode.barcode_data!}
									size={125}
									getRef={c => {
										if (c !== itemQRCodeRef)
											setItemQRCodeRef(c)
									}}
								/>
								<Button
									icon={{ icon: IconUpload, size: 16 }}
									text={'Share'}
									size={'small'}
									variant={'tertiary'}
									onPress={() => {
										itemQRCodeRef?.toDataURL((url: any) => {
											if (url)
												Share.share({
													title: itemQRCode.name,
													url: `data:image/jpeg;base64,${url}`
												})
										})
									}}
								/>
							</View>
						</View>
					)}
				</View>

				{/* -------------------- SCAN HISTORY -------------------- */}
				{sortedScans && sortedScans.length > 0 && (
					<View style={backgroundStyle}>
						<Text variant={'overline'}>Scan history</Text>
						<ScrollView contentContainerStyle={[tw`ml-1 mt-1`]} style={backgroundStyle}>
							{sortedScans.map((scan, scanIndex) => (
								<View
									key={scan.id}
									style={[
										tw`p-2 flex flex-row justify-between border-stone-400`,
										sortedScans.length === 1 ? tw`border rounded` : undefined,
										sortedScans.length !== 1 && scanIndex === 0 ? tw`border-t border-l border-r rounded-t` : undefined,
										sortedScans.length !== 1 && scanIndex === sortedScans.length - 1 ? tw`border rounded-b` : undefined,
										sortedScans.length !== 1 && scanIndex !== 0 && scanIndex !== sortedScans.length - 1 ? tw`border-l border-r border-t` : undefined,
										backgroundStyle
									]}
								>
									<Text variant={'body'}>
										{DateTime.fromISO(scan.created_at).toFormat(`MMM. dd, yyyy 'at' HH:MM`)}
									</Text>
									<View style={[tw`flex flex-row gap-2`, backgroundStyle]}>
										{scan.user_id && scan.user_id === item.user_id && sortedScans.indexOf(scan) === sortedScans.length - 1 && (
											<Text variant={'body'} style={tw`p-1 text-green-500 bg-green-200`}>Activation</Text>
										)}
										{scan.user_id && (
											<Text
												variant={'body'}
												style={tw`p-1 text-${scan.user_id === item.user_id ? 'blue' : 'orange'}-500 bg-${scan.user_id === item.user_id ? 'blue' : 'orange'}-200`}
											>
												{scan.user_id === item.user_id ? 'You' : 'Registered user'}
											</Text>
										)}
										{!scan.user_id && (
											<Text variant={'body'} style={tw`p-1 text-red-500 bg-red-200`}>
												Anonymous user
											</Text>
										)}
									</View>
								</View>
							))
							}
						</ScrollView>
					</View>
				)}
			</View>

			{/* -------------------- FOUND/LOST BUTTON -------------------- */}
			<View style={[tw`px-8`, backgroundStyle]}>
				<Button
					text={item.lost ? 'Found it!' : 'I lost this item'}
					variant={item.lost ? 'secondary' : 'primary'}
					disabled={updating}
					onPress={async () => {
						setUpdating(true)
						try {
							await editItem(item.id, {
								lost: !item.lost,
								lost_at: !item.lost ? DateTime.now().toISO() : undefined,
							})
						} catch (e) {
							console.error(e)
						}
						setUpdating(false)
					}}
				/>
			</View>
		</View>
	)
}
