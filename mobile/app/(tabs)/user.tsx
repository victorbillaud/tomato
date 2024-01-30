import { useAuth } from "@/components/auth/AuthProvider";
import { Text } from "@/components/common/Text";
import { View } from "@/components/View";
import tw from "@/constants/tw";
import Button from "@/components/common/Button";
import React, { useState } from "react";
import { InputText } from "@/components/common/InputText";
import { IconCheck, IconPencil } from "tabler-icons-react-native";
import Switch from "@/components/common/Switch";

export default function UserTab() {
	const { user, userProfile, updateProfile, signOut } = useAuth()

	const [updating, setUpdating] = useState(false)
	const [editing, setEditing] = useState(false)
	const [username, setUsername] = useState(userProfile?.username ?? '')
	const [fullName, setFullName] = useState(userProfile?.full_name ?? '')
	const [phone, setPhone] = useState(userProfile?.phone ?? '')

	return (
		<View style={tw`w-full h-full p-4 flex flex-col justify-between`}>
			<View style={tw`h-12/13 flex flex-col gap-3`}>
				<View style={tw`flex flex-row justify-between `}>
					{/* -------------------- USERNAME -------------------- */}
					<View style={tw`w-2/3 flex flex-col gap-1`}>
						<Text variant={'overline'}>Username</Text>
						{editing
							? <InputText
								placeholder='Username'
								disabled={updating}
								onChangeText={setUsername}
							/>
							: userProfile?.username
								? <Text variant={'body'} style={tw`ml-1`}>{userProfile.username}</Text>
								: <Text variant={'caption'} style={tw`ml-1`}>-</Text>
						}
					</View>

					<View style={tw`flex flex-row gap-3`}>
						{/* -------------------- SAVE CHANGES BUTTON -------------------- */}
						{editing &&
							<Button
								icon={{ icon: IconCheck, color: 'white' }}
								iconOnly
								text={''}
								disabled={updating || (username === userProfile?.username && fullName === userProfile?.full_name && phone === userProfile?.phone)}
								variant={'primary'}
								onPress={async () => {
									setUpdating(true)
									updateProfile({
										username,
										full_name: fullName,
										phone,
									})
									setEditing(false)
									setUpdating(false)
								}}
							/>
						}

						{/* -------------------- EDIT BUTTON -------------------- */}
						<Button
							icon={{ icon: IconPencil }}
							iconOnly
							text={''}
							variant={'secondary'}
							disabled={updating}
							onPress={() => setEditing(!editing)}
						/>
					</View>
				</View>

				{/* -------------------- FULL NAME -------------------- */}
				<View style={tw`flex flex-col gap-1`}>
					<Text variant={'overline'}>Name</Text>
					{editing
						? <InputText
							placeholder='Name'
							disabled={updating}
							onChangeText={setFullName}
						/>
						: userProfile?.full_name
							? <Text variant={'body'} style={tw`ml-1`}>{userProfile.full_name}</Text>
							: <Text variant={'caption'} style={tw`ml-1`}>-</Text>
					}
				</View>

				{/* -------------------- PHONE -------------------- */}
				<View style={tw`flex flex-col gap-1`}>
					<Text variant={'overline'}>Phone</Text>
					{editing
						? <InputText
							placeholder='Phone'
							disabled={updating}
							onChangeText={setPhone}
						/>
						: userProfile?.phone
							? <Text variant={'body'} style={tw`ml-1`}>{userProfile.phone}</Text>
							: <Text variant={'caption'} style={tw`ml-1`}>-</Text>
					}
				</View>

				{/* -------------------- EMAIL -------------------- */}
				<View style={tw`flex flex-col gap-1`}>
					<Text variant={'overline'}>Email</Text>
					{user?.email
						? <Text variant={'body'} style={tw`ml-1`}>{user?.email}</Text>
						: <Text variant={'caption'} style={tw`ml-1`}>-</Text>
					}
				</View>

				{/* -------------------- SETTINGS -------------------- */}
				<View style={tw`flex flex-col gap-1`}>
					<Text variant={'overline'}>Settings</Text>
					<Switch
						text={'E-mail notifications'}
						size={'small'}
						disabled={updating}
						default={userProfile?.email_notifications ?? false}
						onChange={async value => {
							setUpdating(true)
							try {
								await updateProfile({ email_notifications: value })
							} catch (e) {
								console.error(e)
							}
							setUpdating(false)
						}}
					/>
					<Switch
						text={'Notifications for new messages'}
						size={'small'}
						disabled={updating}
						default={userProfile?.message_notifications ?? false}
						onChange={async value => {
							setUpdating(true)
							try {
								await updateProfile({ message_notifications: value })
							} catch (e) {
								console.error(e)
							}
							setUpdating(false)
						}}
					/>
				</View>
			</View>

			<View style={tw`flex flex-row justify-center items-center gap-3`}>
				<Button
					text={'Sign out'}
					variant={'secondary'}
					disabled={updating}
					onPress={signOut}
				/>
			</View>
		</View>
	)
}
