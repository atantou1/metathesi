import { getMatches } from "@/actions/matches"
import { MatchChatClient } from "@/components/matches/MatchChatClient"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export default async function MatchesPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const { active, history } = await getMatches()

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Φόρτωση...</div>}>
            <MatchChatClient activeMatches={active} historyMatches={history} currentUserId={parseInt(session.user.id)} />
        </Suspense>
    )
}
