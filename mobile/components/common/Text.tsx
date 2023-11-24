import React from "react";
import {TextStyle, ViewStyle, Text as DefaultText} from "react-native";
import tw from "../../constants/tw";

export type TTextStyles =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'title'
    | 'subtitle'
    | 'body'
    | 'caption'
    | 'overline';

export interface ITextProps {
    variant: TTextStyles;
    weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
    color?: string;
    children?: React.ReactNode;
    style?: ViewStyle | TextStyle | (ViewStyle | TextStyle)[];
}

export function Text(props:ITextProps) {
    const colorClass = `text-stone-900 dark:text-stone-100`;

    const children = props.children;
    const variant = props.variant;

    const weightClass = {
        100: 'font-thin',
        200: 'font-light',
        300: 'font-normal',
        400: 'font-medium',
        500: 'font-semibold',
        600: 'font-bold',
        700: 'font-extrabold',
    };

    const weightVariantClass = {
        h1: 'font-bold',
        h2: 'font-bold',
        h3: 'font-bold',
        h4: 'font-bold',
        title: 'font-semibold',
        subtitle: 'font-semibold',
        body: 'font-normal',
        caption: 'font-normal',
        overline: 'font-normal',
    };

    const classNameString = [
        props.color ? props.color : colorClass,
        textConfig[variant],
        props.weight ? weightClass[props.weight] : weightVariantClass[variant],
        tw`transition-all`,
        props.style
    ];
    /*
    if (variant === 'h1') {
        return (
            <DefaultText style={[classNameString]} {...props}>
                {children}
            </DefaultText>
        );
    }

    if (variant === 'h2') {
        return (
            <h2 className={classNameString} {...props}>
                {children}
            </h2>
        );
    }

    if (variant === 'h3') {
        return (
            <h3 className={classNameString} {...props}>
                {children}
            </h3>
        );
    }

    if (variant === 'h4') {
        return (
            <h4 className={classNameString} {...props}>
                {children}
            </h4>
        );
    }

    if (variant == 'body') {
        return (
            <p className={`mx-0 my-0 ${classNameString}`} {...props}>
                {children}
            </p>
        );
    }

    return (
        <span className={`${classNameString}`} {...props}>
      {children}
    </span>
    );
    */
}

export const textConfig = {
    h1: 'text-3xl md:text-4xl font-sans',
    h2: 'text-2xl md:text-3xl font-sans',
    h3: 'text-1xl md:text-2xl font-sans',
    h4: 'text-xl md:text-1xl font-sans',
    title: 'text-l md:text-xl font-sans',
    subtitle: 'text-base md:text-l font-sans',
    body: 'text-sm md:text-base font-sans',
    caption: 'text-xs md:text-sm font-sans',
    overline: 'text-xs font-sans',
};


