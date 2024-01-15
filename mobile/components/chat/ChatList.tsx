import {User} from "@supabase/supabase-js";
import {ChatCard} from "@/components/chat/ChatCard";
import {useEffect, useState} from "react";
import { Text } from "@/components/common/Text"
import {Icon} from "@/components/common/Icon";
import { IconUser, IconQrcode } from "tabler-icons-react-native";
import tw from "@/constants/tw";
import {View} from "@/components/View";

export type ChatListProps = {
    conversations: Array<any>;
    currentUser?: User;
};

export function ChatList({
    conversations,
    currentUser
    } : ChatListProps) {

    const [ownedConversations, setOwnedConversations] = useState<
        any[] | null
    >(null);
    const [foundConversations, setFoundConversations] = useState<
        any[] | null
    >(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setOwnedConversations(
            conversations.filter((conv) => conv.owner_id === currentUser?.id)
        );
        setFoundConversations(
            conversations.filter(
                (conv) => conv.finder_id === (currentUser?.id || null)
            )
        );
        setLoading(false);
    }, [conversations, currentUser]);

    const renderConversations = (
        conversationsList: any[]
    ) => {
        return conversationsList.map((conversation) => {
            return (
                <ChatCard
                    key={conversation.id}
                    conversation={conversation}
                    currentUser={currentUser as User}
                    itemId={conversation.item_id}
                />
            );
        });
    };

    return(
        <View className={`flex w-full flex-1 flex-col gap-3 px-5 sm:w-1/3 sm:px-2`}>
            <View className='my-5 ml-3 flex justify-start'>
                <Text variant={'h2'}>Conversations</Text>
            </View>
            <>
                {ownedConversations && ownedConversations.length > 0 && (
                    <View className='flex flex-col gap-1'>
                        <Text
                            variant={'subtitle'}
                            style={tw`flex items-center gap-2 py-2 pl-3`}
                        >
                            <Icon icon={IconUser} size={20} />
                            My items
                        </Text>
                        {renderConversations(ownedConversations)}
                    </View>
                )}
                {foundConversations && foundConversations.length > 0 && (
                    <View className='flex flex-col gap-1'>
                        <Text
                            variant={'subtitle'}
                            style={tw`flex items-center gap-2 py-2 pl-3`}
                        >
                            <Icon icon={IconQrcode} size={20} />
                            Items scanned
                        </Text>
                        {renderConversations(foundConversations)}
                    </View>
                )}
            </>
        </View>
    )
}