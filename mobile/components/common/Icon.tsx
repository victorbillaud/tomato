import {
	IconAlertHexagon,
	IconArrowLeft,
	IconAt,
	IconCheck,
	IconChevronCompactDown,
	IconChevronDown,
	IconChevronUp,
	IconDiscountCheck,
	IconDiscountCheckFilled,
	IconDownload,
	IconListDetails,
	IconLoader,
	IconLock,
	IconMessages,
	IconQrcode,
	IconQuestionMark,
	IconUser,
	IconWritingSign,
	IconWritingSignOff
} from 'tabler-icons-react-native'

const ICONS = {
	'alert': IconAlertHexagon,
	'arrow-left': IconArrowLeft,
	'at': IconAt,
	'check': IconCheck,
	'chevron-compact-down': IconChevronCompactDown,
	'chevron-down': IconChevronDown,
	'chevron-up': IconChevronUp,
	'discount-check': IconDiscountCheckFilled,
	'discount-check-outline': IconDiscountCheck,
	'download': IconDownload,
	'qrcode': IconQrcode,
	'question-mark': IconQuestionMark,
	'list-details': IconListDetails,
	'loader': IconLoader,
	'lock': IconLock,
	'messages': IconMessages,
	'pencil': IconWritingSign,
	'pencil-off': IconWritingSignOff,
	'user': IconUser,
}

export type IconNames = keyof typeof ICONS

export interface IIconProps {
	name: IconNames
	size?: number
	color?: string
	stroke?: number
}

export function Icon({ name, size = 24, color = 'black', stroke = 2, }: IIconProps) {
	const Icon = ICONS[name]
	return <Icon name={name} size={size} color={color} stroke={stroke} />
}

export default Icon
