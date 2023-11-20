import { LinkProps } from 'next/link';
import { IconNames } from '../icon';

export type LinkVariant = 'primary' | 'secondary' | 'tertiary';

export interface ILinkProps extends LinkProps, React.HTMLAttributes<HTMLAnchorElement> {
    text: string;
    icon?: IconNames
    variant?: LinkVariant;
    size?: 'small' | 'medium' | 'large';    
    disabled?: boolean;
    [key: string]: any;
}
