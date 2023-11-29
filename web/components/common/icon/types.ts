import ICONS from './constant';

export type IconNames = keyof typeof ICONS;
export interface IIconProps extends React.HTMLAttributes<HTMLDivElement> {
  name: IconNames;
  size?: number;
  color?: string;
  stroke?: number;
  fill?: boolean;
  animateOnClick?: boolean;
}
