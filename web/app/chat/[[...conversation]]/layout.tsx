export default async function ScanLayout(props: {
    children: React.ReactNode;
    chat: React.ReactNode;
    chatList: React.ReactNode;
    params: { conversation: string[] };
}) {


    return (
        <div className="flex flex-row w-full h-full">
            <div className="flex flex-col w-1/4 h-full border-2">
                {props.chatList}
            </div>
            <div className="flex flex-col w-3/4 h-full border-2">
                {props.chat}
            </div>
        </div>
    )
}