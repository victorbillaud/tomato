import {User} from "@supabase/supabase-js";
import {ChatCard} from "@/components/chat/ChatCard";
import {useEffect, useState} from "react";
import { Text } from "@/components/common/Text"
import {Icon} from "@/components/common/Icon";
import { IconUser, IconQrcode } from "tabler-icons-react-native";
import tw from "@/constants/tw";
import {View} from "@/components/View";
import {ChatCardContent} from "@/components/chat/ChatsProvider";

export type ChatListProps = {
    conversationCards: Array<ChatCardContent>;
    currentUser?: User;
};

export function ChatList({
    conversationCards,
    currentUser
    } : ChatListProps) {

    const [ownedConversations, setOwnedConversations] = useState<
        ChatCardContent[] | null
    >(null);
    const [foundConversations, setFoundConversations] = useState<
        ChatCardContent[] | null
    >(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setOwnedConversations(
            conversationCards.filter((content) => content.conversation.owner_id === currentUser?.id)
        );
        setFoundConversations(
            conversationCards.filter((content) => content.conversation.finder_id === (currentUser?.id || null))
        );
        setLoading(false);
    }, [conversationCards, currentUser]);

    const renderConversations = (
        conversationsList: ChatCardContent[]
    ) => {
        return conversationsList.map((conversationCard) => {
            return (
                <ChatCard
                    key={conversationCard.conversation.id}
                    chatCardContent={conversationCard}
                    currentUser={currentUser as User}
                />
            );
        });
    };

    return(
        <View style={tw`flex w-full flex-col gap-3 px-5`}>
            <>
                {ownedConversations && ownedConversations.length > 0 && (
                    <View style={tw`flex flex-col gap-1`}>
                        <Text
                            variant={'h3'}
                            style={tw`flex items-center gap-2 py-2 pl-3`}
                        >
                            <Icon icon={IconUser} size={20} />
                            My items
                        </Text>
                        {renderConversations(ownedConversations)}
                    </View>
                )}
                {foundConversations && foundConversations.length > 0 && (
                    <View style={tw`flex flex-col gap-1`}>
                        <Text
                            variant={'h3'}
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