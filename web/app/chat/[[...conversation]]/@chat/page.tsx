export default function Page ({ params: { conversation } }: { params: { conversation: string[]} }) {

    if (!conversation) {
        return <div>Default conversation</div>
    }

    return <div>Test {conversation}</div>
}