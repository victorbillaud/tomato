import { LinkProps } from "next/link";

export type LinkVariant = "primary" | "secondary";

export interface ILinkProps extends LinkProps {
    text: string;
    variant?: LinkVariant;
}