import { IconAlertOctagon, IconDiscountCheck } from "tabler-icons-react-native";

export const ITEM_STATUS_LOST = {
	text: 'Item lost',
	description: 'When someone scans its QR code, you will be notified',
	color: 'red-600',
	backgroundColor: 'red-100',
	icon: IconAlertOctagon
}

export const ITEM_STATUS_NOT_ACTIVATED = {
	text: 'Not activated',
	description: 'To activate it, print & scan the QR code on the item',
	color: 'orange-500',
	backgroundColor: undefined,
	icon: IconDiscountCheck
}
