import { TablerIcon } from "tabler-icons-react-native";
import tw from "twrnc";

export interface IIconProps {
	icon: TablerIcon,
	size?: number
	color?: string
	stroke?: number
}

export function Icon({ icon, size = 24, color = 'black', stroke = 2 }: IIconProps) {
	const Icon = icon;
	return <Icon size={size} color={color?.includes('-') ? tw.color(color) : color} stroke={stroke} />
}
