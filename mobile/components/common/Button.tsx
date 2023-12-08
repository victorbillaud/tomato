import React from 'react';
import { ActivityIndicator, GestureResponderEvent, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Style } from 'twrnc/dist/esm/types';
import tw from "../../constants/tw";
import { Text } from './Text';
import Icon, { IIconProps } from "./Icon";

export type TButtonVariant = 'primary' | 'secondary' | 'tertiary';

export type TButtonSize = 'small' | 'medium' | 'large';

export interface IButtonProps {
	text: string;
	isLoader?: boolean;
	icon?: IIconProps;
	iconOnly?: boolean;
	variant?: TButtonVariant;
	disabled?: boolean;
	size?: TButtonSize;
	children?: React.ReactNode;
	onPress?: (event: GestureResponderEvent) => void;
	style?: ViewStyle | TextStyle | (ViewStyle | TextStyle)[];
}

type ButtonStyle = {
	base: Style;
	interact: Style;
};

export function Button(props: IButtonProps) {
	const size = props.size ?? 'medium';
	const variant = props.variant ?? 'primary';

	const sizeStyles = {
		small: tw`text-xs`,
		medium: tw`text-sm`,
		large: tw`text-base`,
	};

	const heightStyles = {
		small: tw`h-8`,
		medium: tw`h-10`,
		large: tw`h-12`,
	};

	const iconSize = {
		small: 16,
		medium: 20,
		large: 24,
	};

	const iconColor = {
		primary: 'white',
		secondary: 'gray',
		tertiary: 'gray',
	};

	const buttonClasses = getButtonClass(variant);
	const textClasses = getTextClass(variant);

	const handlePress = (event: GestureResponderEvent) => {
		if (!props.disabled && !props.isLoader && props.onPress) {
			props.onPress(event);
		}
	};

	return (
		<TouchableOpacity
			onPress={handlePress}
			disabled={props.disabled || props.isLoader}
			style={[
				buttonClasses.base,
				tw`py-1`,
				props.disabled ? tw`opacity-50` : buttonClasses.interact,
				tw`flex items-center justify-center`,
				!props.isLoader && props.icon ? tw`py-0 pl-1` : tw`py-0`,
				heightStyles[size],
				props.style,
			]}
		>
			{props.isLoader ? (
				<View style={tw`flex h-full w-full items-center justify-center pr-1`}>
					<ActivityIndicator color={iconColor[variant]} size={iconSize[size]} />
				</View>
			) : (
				<View style={tw`flex flex-row`}>
					{props.icon && (
						<View style={tw`pr-2`}>
							<Icon {...props.icon} />
						</View>
					)}
					{!props.iconOnly && (
						<Text style={[sizeStyles[size], props.icon ? tw`pr-2` : tw`px-4`, textClasses]} variant={'body'}>
							{props.text}
						</Text>
					)}
				</View>
			)}
			{props.children}
		</TouchableOpacity>
	);
};

const getButtonClass = (style: TButtonVariant): ButtonStyle => {
	switch (style) {
		case 'primary':
			return {
				base: tw`rounded-md border border-transparent bg-primary-900 shadow-sm`,
				interact: tw`hover:bg-primary-950 focus:outline-none focus:ring-2 focus:ring-primary-950 focus:ring-offset-2`,
			};
		case 'secondary':
			return {
				base: tw`rounded-md border dark:border-gray-100 bg-gray-100 dark:bg-transparent shadow-sm`,
				interact: tw`hover:bg-gray-200 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200`,
			};
		case 'tertiary':
			return {
				base: tw`rounded-md border border-transparent bg-transparent`,
				interact: tw`hover:text-gray-500 dark:hover:text-gray-500 focus:outline-none`,
			};
	}
};

const getTextClass = (style: TButtonVariant): Style => {
	switch (style) {
		case 'primary':
			return tw`font-medium text-gray-100`;
		case 'secondary':
			return tw`font-medium text-gray-700 dark:text-gray-100`;
		case 'tertiary':
			return tw`font-medium text-gray-700 dark:text-gray-200`;
	}
}

export default Button;
