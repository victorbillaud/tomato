import React from 'react';
import { IconNames } from '../icon';

export type TTagColor =
    | 'red'
    | 'green'
    | 'blue'
    | 'yellow'
    | 'orange'
    | 'purple'
    | 'pink'
    | 'primary'
    | 'warning';

export type TTagSize = 'small' | 'medium' | 'large';

export interface ITag extends React.HTMLAttributes<HTMLDivElement> {
    text: string;
    color: TTagColor;
    size?: TTagSize;
    icon?: IconNames;
}
