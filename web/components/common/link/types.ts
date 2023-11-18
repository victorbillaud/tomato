import { LinkProps } from 'next/link';

export type LinkVariant = 'primary' | 'secondary' | 'tertiary';

export interface ILinkProps extends LinkProps, React.HTMLAttributes<HTMLAnchorElement> {
    text: string;
    variant?: LinkVariant;
    size?: 'small' | 'medium' | 'large';    
    [key: string]: any;
}
