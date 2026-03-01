import { getMatches } from "@/actions/matches"
import { MatchChatClient } from "@/components/matches/MatchChatClient"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function MatchesPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const { active, history } = await getMatches()

    return <MatchChatClient activeMatches={active} historyMatches={history} currentUserId={parseInt(session.user.id)} />
}
