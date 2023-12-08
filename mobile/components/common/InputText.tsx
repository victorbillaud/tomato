import React from 'react'
import { Icon, IconNames } from './Icon'
import { Text } from './Text'
import { View } from "../Themed"
import { TextInput } from "react-native";
import tw from "../../constants/tw"

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	labelText?: string
	error?: string
	children?: React.ReactNode
	icon?: IconNames
	onChangeText?: ((text: string) => void) | undefined;
}

export function InputText(props: IProps) {
	return (
		<View style={tw`flex w-full flex-col gap-1`}>
			{/* -------------------- LABEL & ERROR -------------------- */}
			{props.labelText && (
				<View style={tw`flex flex-row items-center justify-between gap-3`}>
					<label style={tw`text-left`} htmlFor='txt'>
						<Text
							variant='caption'
							style={tw`py-0 pl-1 font-medium capitalize`}
							weight={500}
						>
							{props.labelText}
						</Text>
					</label>
					{props.error && (
						<Text variant='overline' style={tw`text-red-600`}>
							{props.error}
						</Text>
					)}
				</View>
			)}

			{/* -------------------- ICON & INPUT -------------------- */}
			<View style={[
				tw`group flex items-stretch gap-2 border shadow-sm`,
				props.error
					? tw`animate-shake border border-red-500 bg-red-700/10`
					: tw`border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 bg-zinc-100`,
				tw`text-s text-black-100 dark:text-white-100 w-full px-2 py-2 outline-none transition-all lg:text-sm xl:text-base`,
				props.children ? tw`rounded-r-md` : tw`rounded-md`
			]}>
				{props.icon && <Icon name={props.icon} size={20} />}

				<TextInput
					onChangeText={props.onChangeText}
					style={tw`w-full border-none bg-transparent text-gray-700 outline-none placeholder:opacity-20 group-focus:border-transparent group-focus:outline-none group-focus:ring-2 group-focus:ring-gray-200 dark:text-gray-200`}
				/>

				<View style={tw`flex`}>{props.children}</View>
			</View>
		</View>
	)
}

InputText.displayName = 'InputText'
