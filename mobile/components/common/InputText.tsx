import React from 'react'
import { Icon, IconNames } from './Icon'
import { Text } from './Text'
import { View } from "../Themed"
import {TextInput, ViewStyle} from "react-native";
import tw from "../../constants/tw"

interface IProps {
	labelText?: string
	error?: string
	children?: React.ReactNode
	icon?: IconNames
	onChangeText?: ((text: string) => void) | undefined;
	placeholder?: string
	style?: ViewStyle | ViewStyle[]
}

export function InputText(props: IProps) {
	return (
		<View style={[tw`flex w-full flex-col gap-1`, props.style]}>
			{/* -------------------- LABEL & ERROR -------------------- */}
			{props.labelText && (
				<View style={tw`flex flex-row items-center justify-between gap-3`}>
					<View style={tw`text-left`}>
						<Text
							variant='caption'
							style={tw`py-0 pl-1 font-medium capitalize`}
							weight={500}
						>
							{props.labelText}
						</Text>
					</View>
					{props.error && (
						<Text variant='overline' style={tw`text-red-600`}>
							{props.error}
						</Text>
					)}
				</View>
			)}

			{/* -------------------- ICON & INPUT -------------------- */}
			<View style={[
				tw`flex items-stretch gap-2 border shadow-sm`,
				props.error
					? tw`border border-red-500 bg-red-700/10`
					: tw`border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 bg-zinc-100`,
				tw`text-sm text-black dark:text-white-100 w-full px-2 py-2 lg:text-sm xl:text-base`,
				props.children ? tw`rounded-r-md` : tw`rounded-md`
			]}>
				{props.icon && <Icon name={props.icon} size={20} />}

				<TextInput
					onChangeText={props.onChangeText}
					style={tw`w-full bg-transparent text-gray-700 placeholder:opacity-20 dark:text-gray-200`}
					placeholder={props.placeholder}
				/>

				<View style={tw`flex`}>{props.children}</View>
			</View>
		</View>
	)
}

InputText.displayName = 'InputText'