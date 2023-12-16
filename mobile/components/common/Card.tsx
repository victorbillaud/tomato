import React from 'react'
import { View, ViewProps } from "@/components/View"
import tw from "@/constants/tw"

export interface ICardProps extends ViewProps {
	children?: React.ReactNode
	style?: ViewProps['style']
}

export function Card(props: ICardProps) {
	return (
		<View style={[
			tw`rounded-md border border-stone-300 bg-stone-200 shadow-sm dark:border-stone-700 dark:bg-stone-900`,
			props.style
		]}>
			{props.children}
		</View>
	);
}

Card.displayName = 'Card';
