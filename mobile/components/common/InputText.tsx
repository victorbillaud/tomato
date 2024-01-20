import React from 'react'
import { TextInput } from "react-native";
import { Icon, IIconProps } from '@/components/common/Icon'
import { Text } from '@/components/common/Text'
import tw from "@/constants/tw"
import { View } from "@/components/View";

interface IProps {
	labelText?: string
	error?: string
	children?: React.ReactNode
	iconProps?: IIconProps
	onChangeText?: ((text: string) => void) | undefined;
	placeholder?: string
	password?: boolean
	multiline?: boolean
	disabled?: boolean
}

export function InputText(props: IProps) {
	return (
		<View style={tw`w-full flex flex-col gap-1`}>
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
				{props.iconProps && <Icon {...props.iconProps} size={20} />}

				<TextInput
					onChangeText={props.onChangeText}
					style={tw`w-full bg-transparent text-gray-700 placeholder:opacity-20 dark:text-gray-200`}
					placeholder={props.placeholder}
					secureTextEntry={props.password ?? false}
					multiline={props.multiline ?? false}
					editable={!props.disabled}
				/>

				<View style={tw`flex`}>{props.children}</View>
			</View>
		</View>
	)
}

InputText.displayName = 'InputText'
