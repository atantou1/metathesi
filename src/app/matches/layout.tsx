import { getMatches } from "@/actions/matches"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { MatchesLayoutClient } from "@/components/matches/MatchesLayoutClient"

export default async function MatchesLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const { active, history } = await getMatches()

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Φόρτωση...</div>}>
            <MatchesLayoutClient 
                activeMatches={active} 
                historyMatches={history} 
                currentUserId={parseInt(session.user.id)}
            >
                {children}
            </MatchesLayoutClient>
        </Suspense>
    )
}
