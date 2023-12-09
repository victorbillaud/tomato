import React from 'react'
import { Button } from "./common/Button"
import { InputText } from "./common/InputText"
import { Icon } from "./common/Icon"
import { Text } from "./common/Text"
import { ScrollView, View } from "./View";
import tw from "../constants/tw";
import { Card } from "./common/Card";

export function TestComponents() {
	return (
		<ScrollView style={tw`w-4/5 max-h-3/5`}>
			<View style={tw`gap-3`}>
				<Card style={tw`p-5`}>
					<Text variant={"h1"}>Heading 1</Text>
					<Text variant={"h2"}>Heading 2</Text>
					<Text variant={'title'}>Title</Text>
					<Text variant={'body'}>Body</Text>
					<Icon name={"check"} color={'green'} />
				</Card>
				<Card style={tw`p-5 gap-3`}>
					<InputText labelText={"Input"} placeholder={"test"} onChangeText={text => console.log(text)} />
					<InputText labelText={"Input (with error)"} error={"Error!"} />
				</Card>
				<Card style={tw`p-5 gap-2`}>
					<Button text={"Button (primary)"} variant={"primary"} />
					<Button text={"Button (secondary)"} variant={"secondary"} />
					<Button text={"Button (tertiary)"} variant={"tertiary"} />
					<Button text={"Button (large)"} size={"large"} />
					<Button text={"Button (medium)"} size={"medium"} />
					<Button text={"Button (small)"} size={"small"} />
					<Button text={"Button (disabled)"} disabled={true} />
					<Button text={"Button (with icon)"} icon={{ name: 'alert', color: 'red' }} />
				</Card>
			</View>
		</ScrollView>
	)
}
