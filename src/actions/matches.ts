"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { findMatches, MatchResult } from "@/lib/matching"

export async function getMatches(): Promise<{ active: MatchResult[], history: MatchResult[] }> {
    const session = await auth()
    if (!session?.user?.id) {
        return { active: [], history: [] }
    }

    const userId = parseInt(session.user.id)
    const profile = await prisma.profile.findUnique({
        where: { userId }
    })

    if (!profile) {
        return { active: [], history: [] }
    }

    // Run matching algorithm / Fetch matches
    const allMatches = await findMatches(profile.id)

    // Separate into Active and History
    const active = allMatches.filter(m => m.status === 'active')
    const history = allMatches.filter(m => m.status !== 'active')

    return { active, history }
}
