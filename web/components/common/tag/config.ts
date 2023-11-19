import { TTagColor } from "./types";

export const tagsConfig: Record<TTagColor, {
    textColor: string;
    iconColor: string;
    bgColor: string;
}> = {
    red: {
        textColor: 'text-red-800',
        iconColor: 'text-red-800',
        bgColor: 'bg-red-800',
    },
    green: {
        textColor: 'text-lime-800',
        iconColor: 'text-lime-800',
        bgColor: 'bg-lime-800',
    },
    blue: {
        textColor: 'text-blue-700',
        iconColor: 'text-blue-700',
        bgColor: 'bg-blue-700',
    },
    yellow: {
        textColor: 'text-yellow-700',
        iconColor: 'text-yellow-700',
        bgColor: 'bg-yellow-700',
    },
    orange: {
        textColor: 'text-orange-700',
        iconColor: 'text-orange-700',
        bgColor: 'bg-orange-700',
    },
    purple: {
        textColor: 'text-purple-800',
        iconColor: 'text-purple-800',
        bgColor: 'bg-purple-800',
    },
    pink: {
        textColor: 'text-pink-700',
        iconColor: 'text-pink-700',
        bgColor: 'bg-pink-700',
    },
    primary: {
        textColor: 'text-primary-500',
        iconColor: 'text-primary-500',
        bgColor: 'bg-primary-500',
    },
    warning: {
        textColor: 'text-orange-700',
        iconColor: 'text-orange-700',
        bgColor: 'bg-orange-700',
    },
};