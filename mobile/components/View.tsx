import { ScrollView as RNScrollView, View as RNView } from "react-native";
import { ThemeProps, useThemeColor } from "@/components/Themed";

export type ViewProps = ThemeProps & RNView['props']

export function View(props: ViewProps) {
	const { style, lightColor, darkColor, ...otherProps } = props
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')

	return <RNView style={[{ backgroundColor }, style]} {...otherProps} />
}

export function ScrollView(props: ViewProps) {
	const { style, lightColor, darkColor, ...otherProps } = props
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')

	return <RNScrollView style={[{ backgroundColor }, style]} {...otherProps} />
}
