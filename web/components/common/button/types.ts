import React from 'react';
import { IconNames } from '../icon';

export type TButtonVariant = 'primary' | 'secondary' | 'tertiary' | "custom";

export type TButtonSize = 'small' | 'medium' | 'large';

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  isLoader?: boolean;
  icon?: IconNames;
  iconOnly?: boolean;
  variant: TButtonVariant;
  disabled?: boolean;
  size?: TButtonSize;
  children?: React.ReactNode;
}
