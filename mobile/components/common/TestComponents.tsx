import React from 'react'
import { View } from "../Themed"
import { Button } from "./Button"
import { InputText } from "./InputText"
import Icon from "./Icon"
import { Text } from "./Text"

export function TestComponents() {
	return (
		<View>
			<Icon name={"check"} color={'green'} />
			<Text variant={"h1"}>Heading 1</Text>
			<Text variant={"h2"}>Heading 2</Text>
			<Text variant={'body'}>Body</Text>
			<InputText labelText={"Input"} />
			<InputText labelText={"Input (with error)"} error={"Error!"} />
			<Button text={"Button (primary)"} variant={"primary"} />
			<Button text={"Button (secondary)"} variant={"secondary"} />
			<Button text={"Button (tertiary)"} variant={"tertiary"} />
			<Button text={"Button (large)"} size={"large"} />
			<Button text={"Button (medium)"} size={"medium"} />
			<Button text={"Button (small)"} size={"small"} />
			<Button text={"Button (disabled)"} disabled={true} />
			<Button text={"Button (with icon)"} icon={{ name: 'alert', color: 'red' }} />
		</View>
	)
}
