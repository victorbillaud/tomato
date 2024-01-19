import {User} from "@supabase/supabase-js";
import { Text } from "@/components/common/Text"
import {View} from "@/components/View";
import {useState} from "react";
import {Database} from "@/utils/supabase/supabase_types";
import {Icon} from "@/components/common/Icon";
import {Image} from "react-native";
import {IconUserCircle} from "tabler-icons-react-native";
import {ChatCardContent} from "@/components/chat/ChatsProvider";
import dateFormat from 'dateformat';
import tw from "@/constants/tw";


export type ChatCardProps = {
    chatCardContent: ChatCardContent;
    currentUser?: User;
};

export function ChatCard({
    chatCardContent,
    currentUser
    } : ChatCardProps) {

    const avatarUrl = chatCardContent.otherUser?.avatar_url;
    const itemInfo = chatCardContent.itemInfo;
    const lastMessage = chatCardContent.conversation.last_message;

    function displayLastMessageDate() {
        const today = new Date();
        const lastMsgDate = new Date(
            lastMessage?.created_at || chatCardContent.conversation.created_at
        );
        const timeDifference = today.getTime() - lastMsgDate.getTime();

        // If the message was sent today, display only the time
        if (today.getDate() === lastMsgDate.getDate()) {
            return dateFormat(lastMsgDate, 'HH:MM');
        }
        // If the message was sent less than 7 days ago, display the day of the week and the time
        else if (timeDifference < 7 * 24 * 60 * 60 * 1000) {
            return dateFormat(lastMsgDate, 'ddd HH:MM');
        }
        // If it was sent less than a year ago, display the day and the month
        else if (timeDifference < 365 * 24 * 60 * 60 * 1000) {
            return dateFormat(lastMsgDate, 'd mmm');
        }
        // else display the day, the month and the year
        else {
            return dateFormat(lastMsgDate, 'd mmm yy');
        }
    }

    const renderTag = () => {
        /*
        if (itemInfo && itemInfo.lost) {
            return <Tag text='lost' color='red' size='small' />;
        } else if (itemInfo && !itemInfo.lost) {
            return <Tag text='found' color='green' size='small' />;
        }
         */
        return null;
    };

    return(
        <>
            <View style={tw`flex-shrink-0`}>
                {avatarUrl ? (
                    <Image
                        source={{uri : avatarUrl}}
                        alt='avatar'
                        width={36}
                        height={36}
                        className='rounded-full border-[1px] border-gray-700 dark:border-white/20'
                    />
                ) : (
                    <Icon
                        icon={IconUserCircle}
                        size={40}
                        stroke={1}
                        color='black'
                    />
                )}
            </View>

            <View style={tw`flex-grow truncate`}>
                <Text variant={'subtitle'}>
                    {itemInfo?.name || 'Item found'}
                </Text>
                <View style={tw`flex items-center`}>
                    <Text
                        variant={'body'}
                        color='text-black dark:text-stone-100'
                    >
                        {lastMessage?.sender_id === currentUser?.id ? 'You: ' : ''}
                        {lastMessage?.content || 'No messages yet'}
                    </Text>
                </View>
            </View>

            <View style={tw`flex flex-shrink-0 flex-col items-end gap-1`}>
                {renderTag()}
                <Text variant={'caption'} color='text-black/90 dark:text-stone-100/70'>
                    {displayLastMessageDate()}
                </Text>
            </View>
        </>
)
}