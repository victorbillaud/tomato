import { listItems } from "@utils/lib/item/services";

type ArrayElementType<T> = T extends (infer U)[] ? U : never;

type ItemType = ArrayElementType<Awaited<ReturnType<typeof listItems>>['data']>;

export interface IItemCardProps {
    item: ItemType;
}

