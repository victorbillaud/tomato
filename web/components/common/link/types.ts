import { LinkProps } from 'next/link';

export type LinkVariant = 'primary' | 'secondary' | 'tertiary';

export interface ILinkProps extends LinkProps {
    text: string;
    variant?: LinkVariant;
    [key: string]: any;
}
