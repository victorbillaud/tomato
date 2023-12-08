import { FunctionComponent } from 'react';
import { IconArrowLeft, IconLoader, IconDiscountCheckFilled, IconDiscountCheck,IconAlertHexagon, IconChevronCompactDown, IconLock, IconAt, IconQrcode, IconQuestionMark, IconDownload, IconWritingSign, IconWritingSignOff, IconCheck, IconChevronDown,IconChevronUp } from '@tabler/icons-react';

const ICONS = {
    'arrow-left': IconArrowLeft,
    'loader': IconLoader,
    'discount-check': IconDiscountCheckFilled,
    'discount-check-outline': IconDiscountCheck,
    'alert': IconAlertHexagon,
    'chevron-compact-down': IconChevronCompactDown,
    'lock': IconLock,
    'at': IconAt,
    'qrcode': IconQrcode,
    'question-mark': IconQuestionMark,
    'download': IconDownload,
    'pencil': IconWritingSign,
    'pencil-off': IconWritingSignOff,
    'check': IconCheck,
    'chevron-down': IconChevronDown,
    'chevron-up': IconChevronUp,
};

export type IconNames = keyof typeof ICONS;
export interface IIconProps {
    name: IconNames;
    size?: number;
    color?: string;
    stroke?: number;
}

export const Icon: FunctionComponent<IIconProps> = ({
            name,
            size = 24,
            color = 'black',
            stroke = 2,
        }) => {
    const Icon = ICONS[name];

    return <Icon name={name} size={size} color={color} stroke={stroke} />;
};

export default Icon;
