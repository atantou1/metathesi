import { MatchChatArea } from "@/components/matches/MatchChatArea"

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return <MatchChatArea matchId={parseInt(resolvedParams.id)} />
}
