import ICONS from "./constant";

export type IconNames = keyof typeof ICONS;
export interface IIconProps {
    name: IconNames;
    size?: number;
    color?: string;
    stroke?: number;
}