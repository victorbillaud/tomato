import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

/** You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/ */
export function Icon(props: {
	name: React.ComponentProps<typeof FontAwesome>['name']
	color: string
}) {
	return <FontAwesome size={28} {...props} />
}
