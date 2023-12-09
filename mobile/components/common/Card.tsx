import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import tw from "../../constants/tw";

export interface ILayoutProps extends ViewProps {
    children?: React.ReactNode;
    style?: ViewProps['style'];
}

const Card = React.forwardRef<View, ILayoutProps>(
    ({ children, style: Style, ...props }, ref) => {
        return (
            <View
                style={[
                    tw`rounded-md border border-stone-300 bg-stone-200 shadow-sm dark:border-stone-700 dark:bg-stone-900`, Style
                ]}
                ref={ref}
                {...props}
            >
                {children}
            </View>
        );
    }
);

Card.displayName = 'Card';

export default Card;
