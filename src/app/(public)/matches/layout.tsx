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
            <div className="min-h-screen pt-20 flex flex-col px-4 sm:px-6 lg:px-8">
                <MatchesLayoutClient 
                    activeMatches={active} 
                    historyMatches={history} 
                    currentUserId={parseInt(session.user.id)}
                >
                    {children}
                </MatchesLayoutClient>
            </div>
        </Suspense>
    )
}
