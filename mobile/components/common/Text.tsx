import { Text as DefaultText, TextStyle, ViewStyle } from "react-native"
import { ReactNode } from "react"
import tw from "@/constants/tw"

export interface ITextProps {
	variant: 'h1' | 'h2' | 'h3' | 'h4' | 'title' | 'subtitle' | 'body' | 'caption' | 'overline'
	weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
	color?: string
	children?: ReactNode
	style?: ViewStyle | TextStyle | (ViewStyle | TextStyle)[]
}

export function Text(props: ITextProps) {
	const variant = props.variant

	return (
		<DefaultText
			{...props}
			style={[
				props.color ? tw`default` : tw`text-stone-900 dark:text-stone-100`,
				textConfig[variant],
				props.weight ? weightClass[props.weight] : weightVariantClass[variant],
				variant === 'body' ? tw`mx-0 my-0` : null,
				props.style,
			]}
		>
			{props.children}
		</DefaultText>
	)
}

const weightClass = {
	100: tw`font-thin`,
	200: tw`font-light`,
	300: tw`font-normal`,
	400: tw`font-medium`,
	500: tw`font-semibold`,
	600: tw`font-bold`,
	700: tw`font-extrabold`,
}

const weightVariantClass = {
	h1: tw`font-bold`,
	h2: tw`font-bold`,
	h3: tw`font-bold`,
	h4: tw`font-bold`,
	title: tw`font-semibold`,
	subtitle: tw`font-semibold`,
	body: tw`font-normal`,
	caption: tw`font-normal`,
	overline: tw`font-normal`,
}

export const textConfig = {
	h1: tw`text-3xl md:text-4xl`,
	h2: tw`text-2xl md:text-3xl`,
	h3: tw`text-xl md:text-2xl`,
	h4: tw`text-xl md:text-1xl`,
	title: tw`text-lg md:text-xl`,
	subtitle: tw`text-base md:text-lg`,
	body: tw`text-sm md:text-base`,
	caption: tw`text-xs md:text-sm`,
	overline: tw`text-xs capitalize`,
}

/* TODO: use theme like the following example :
	export function Text(props: TextProps) {
		const { style, lightColor, darkColor, ...otherProps } = props
		const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

		return <DefaultText style={[{ color }, style]} {...otherProps} />
	}
 */
