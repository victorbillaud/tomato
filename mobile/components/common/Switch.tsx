import React, { useState } from 'react'
import { Switch as RNSwitch, ViewStyle } from 'react-native'
import tw from "@/constants/tw"
import { Text } from "@/components/common/Text";
import { View } from "@/components/View";

type SwitchVariant = 'primary' | 'secondary'
type SwitchSize = 'small' | 'medium' | 'large'

interface Props {
	default?: boolean
	onChange: (value: boolean) => void
	variant?: SwitchVariant
	disabled?: boolean
	size?: SwitchSize
	style?: ViewStyle | (ViewStyle | undefined)[]
	text?: string
}

export default function Switch(props: Props) {
	const [value, setValue] = useState(props.default ?? false)

	const styleHeight = STYLE_HEIGHT[props.size ?? 'medium']
	const styleVariant = STYLE_VARIANT[props.variant ?? 'primary']

	return (
		<View style={[tw`w-full flex flex-row gap-${styleHeight.gap} items-center`, props.style]}>
			<RNSwitch
				value={value}
				onValueChange={value => {
					setValue(value)
					props.onChange(value)
				}}
				trackColor={{ false: styleVariant.backgroundValue, true: styleVariant.backgroundValue }}
				thumbColor={styleVariant.colorValue}
				style={[{ transform: [{ scale: styleHeight.scale }] }]}
				disabled={props.disabled}
			/>
			{props.text && (
				<Text variant={'body'}>{props.text}</Text>
			)}
		</View>
	)
}

const STYLE_HEIGHT = {
	small: {
		scale: 0.8,
		gap: 1
	},
	medium: {
		scale: 1.0,
		gap: 2
	},
	large: {
		scale: 1.2,
		gap: 3
	},
}

const STYLE_VARIANT = {
	primary: {
		colorValue: tw.color('primary-900'),
		backgroundValue: tw.color('primary-200'),
	},
	secondary: {
		colorValue: tw.color('gray-200'),
		backgroundValue: tw.color('gray-100'),
	},
}
