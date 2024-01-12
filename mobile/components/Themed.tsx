/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, useColorScheme } from 'react-native'
import Colors from '@/constants/Colors'

export type ThemeProps = {
	lightColor?: string
	darkColor?: string
}

export type TextProps = ThemeProps & DefaultText['props']

export function useThemeColor(
	props: { light?: string, dark?: string },
	colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
	const theme = useColorScheme() ?? 'light'
	const colorFromProps = props[theme]

	if (colorFromProps) {
		return colorFromProps
	} else {
		return Colors[theme][colorName]
	}
}
