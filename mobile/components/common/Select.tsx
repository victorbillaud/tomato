import React, { useState } from 'react'
import { Pressable, TextStyle, ViewStyle } from 'react-native'
import tw from "@/constants/tw"
import { ScrollView, View } from "@/components/View";
import { Icon } from "@/components/common/Icon";
import { Text } from "@/components/common/Text";
import { IconChevronDown, IconChevronUp } from "tabler-icons-react-native";

type SelectVariant = 'primary' | 'secondary' | 'tertiary'
type SelectSize = 'small' | 'medium' | 'large'

interface SelectOption<Value = any> {
	label: string,
	value: Value
}

interface Props<Value = any> {
	options: SelectOption<Value>[]
	onChange: (value: Value) => void
	variant?: SelectVariant
	disabled?: boolean
	size?: SelectSize
	style?: ViewStyle | TextStyle | (ViewStyle | TextStyle)[]
	placeholder?: string
}

export default function Select<Value = any>(props: Props) {
	const [shown, setShown] = useState(false)
	const [selectedValue, setSelectedValue] = useState<SelectOption<Value>>()

	const size = props.size ?? 'medium'
	const variant = props.variant ?? 'primary'

	return (
		<View>
			<Pressable onPress={() => setShown(!shown)}>
				<View style={[
					tw`flex flex-row items-center px-2`,
					STYLE_BASE[variant],
					STYLE_HEIGHT[size],
					props.style
				]}>
					<Text
						variant={'body'}
						style={[
							tw`flex-1 text-center capitalize`,
							STYLE_TEXT[variant],
						]}
					>
						{selectedValue?.label ?? props.placeholder ?? 'Select...'}
					</Text>
					<Icon
						icon={shown ? IconChevronUp : IconChevronDown}
						size={20}
						color={tw.color(ICON_COLORS[variant])}
					/>
				</View>
			</Pressable>

			{shown && (
				<ScrollView
					style={tw`w-full h-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md`}
					contentContainerStyle={tw`p-2`}
				>
					{props.options.map(option => (
						<Pressable
							key={option.label}
							onPress={() => {
								setSelectedValue(option)
								props.onChange(option.value)
								setShown(false)
							}}
						>
							<View
								style={[
									tw`flex-1 p-2`,
									STYLE_TEXT[variant],
								]}
							>
								<Text style={tw`capitalize`}>{option.label}</Text>
							</View>
						</Pressable>
					))}
				</ScrollView>
			)}

		</View>
	)
}

const ICON_COLORS = {
	primary: `text-white`,
	secondary: `text-gray-500 dark:text-gray-500`,
	tertiary: `text-gray-500 dark:text-gray-500`,
}

const STYLE_HEIGHT = {
	small: tw`h-8`,
	medium: tw`h-10`,
	large: tw`h-12`,
}

const STYLE_BASE = {
	primary: tw`rounded-md border border-transparent bg-primary-900 shadow-sm`,
	secondary: tw`rounded-md border dark:border-gray-100 bg-gray-100 dark:bg-transparent shadow-sm`,
	tertiary: tw`rounded-md border border-transparent bg-transparent`,
}

const STYLE_TEXT = {
	primary: tw`text-white hover:bg-primary-950 focus:outline-none focus:ring-2 focus:ring-primary-950 focus:ring-offset-2`,
	secondary: tw`text-gray-500 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200`,
	tertiary: tw`text-gray-500 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-500 focus:outline-none`,
}
