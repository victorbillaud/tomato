import React from 'react';
import { IconNames } from '../icon';


export type TButtonVariant =
    | 'primary'
    | 'secondary'

export type TButtonSize = 'small' | 'medium' | 'large';

export interface IButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    isLoader?: boolean;
    icon?: IconNames;
    iconOnly?: boolean;
    variant: TButtonVariant;
    size?: TButtonSize;
    children?: React.ReactNode;
}