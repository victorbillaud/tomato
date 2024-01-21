import { useLocalSearchParams, useNavigation } from "expo-router";
import { Text } from "@/components/common/Text"
import {useLayoutEffect} from "react";

export default function ChatPage() {

    const chatId = useLocalSearchParams()['chatId']
    const navigation = useNavigation()
    const backgroundStyle = undefined


    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chat',
            headerStyle: backgroundStyle,
        })
    })

    return (
            <Text variant={"subtitle"}>
                {chatId}
            </Text>
        );
}