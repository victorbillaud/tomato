import { Text } from "@/components/common/Text";
import { View } from "@/components/View";
import tw from "@/constants/tw";
import {ChatList} from "@/components/chat/ChatList";
import {useChats} from "@/components/chat/ChatsProvider";
import {useAuth} from "@/components/auth/AuthProvider";
import {User} from "@supabase/gotrue-js";


export default async function ChatsTab() {

	const {conversations} = useChats();
	const {user} = useAuth();

	return (
		<>
			{conversations.length > 0 ? (
				<View className='flex h-[80vh] w-full overflow-hidden'>
					<ChatList conversations={conversations} currentUser={user as User} />
				</View>
			) : (
				<View className='my-10 flex w-full max-w-[700px] flex-col items-center justify-start gap-10 px-3 text-center'>
					<Text variant='h3'>You don&apos;t have any conversations yet</Text>
					<Text variant='body' style={tw`mx-5`}>
						Found a lost object? Scan its QR Code to start a chat with its owner
						! Or, if you&apos;ve lost something, wait for someone to find it and
						contact you!
					</Text>
				</View>
			)}
		</>
	)
}
