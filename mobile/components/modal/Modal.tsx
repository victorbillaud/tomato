import { Text } from "@/components/common/Text";
import { View } from "@/components/View";
import tw from "@/constants/tw";
import React, { ReactNode } from "react";
import { Modal as RNModal } from "react-native";
import Button from "@/components/common/Button";

interface Props {
	title: string
	closeButtonText: string
	children?: ReactNode
	footer?: ReactNode
	close: () => void
}

export default function Modal(props: Props) {
	return (
		<RNModal
			animationType='fade'
			transparent={true}
			visible={true}
			onRequestClose={props.close}
		>
			<View style={tw`w-full h-full bg-black/50`}>
				<View style={tw`w-6/7 h-9/10 mx-auto mt-14 p-4 flex flex-col justify-between rounded-xl`}>
					<View style={tw`flex flex-col items-center gap-3`}>
						<Text variant={'h1'}>{props.title}</Text>
						<View style={tw`flex flex-col gap-3`}>
							{props.children}
						</View>
					</View>
					<View style={tw`flex flex-row justify-between items-center gap-3`}>
						<Button
							text={props.closeButtonText}
							variant={'secondary'}
							onPress={props.close}
						/>
						{props.footer}
					</View>
				</View>
			</View>
		</RNModal>
	)
}
