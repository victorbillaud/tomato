import { HTMLAttributes } from 'react';

export type TTextStyles =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'overline'
  | 'none';

export interface ITextProps extends HTMLAttributes<HTMLDivElement> {
  variant: TTextStyles;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  color?: string;
}
