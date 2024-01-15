//import {TConversationWithLastMessage} from "@utils/lib/messaging/services";
import {User} from "@supabase/supabase-js";
import { Text } from "@/components/common/Text"
import {View} from "@/components/View";

export type ChatCardProps = {
    conversation: any;
    selectedConversationId?: string;
    currentUser: User;
    itemId: string;
};

export function ChatCard({
    conversation,
    currentUser,
    itemId
    } : ChatCardProps) {
    return(
        <View>
            <Text variant={'subtitle'}>Conversation id : {conversation.id}</Text>
        </View>
    )
}