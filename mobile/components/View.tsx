import { ScrollView as RNScrollView, View as RNView } from "react-native";
import { ThemeProps, useThemeColor } from "@/components/Themed";

export function View(props: ThemeProps & RNView['props']) {
	const { style, lightColor, darkColor, ...otherProps } = props
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')

	return <RNView style={[{ backgroundColor }, style]} {...otherProps} />
}

export function ScrollView(props: ThemeProps & RNScrollView['props']) {
	const { style, lightColor, darkColor, ...otherProps } = props
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')

	return <RNScrollView style={[{ backgroundColor }, style]} {...otherProps} />
}
