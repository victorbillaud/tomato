import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export interface IconProps {
	name: React.ComponentProps<typeof FontAwesome>['name']
	color: string
}

/** You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/ */
export function Icon(props: IconProps) {
	return <FontAwesome size={28} {...props} />
}