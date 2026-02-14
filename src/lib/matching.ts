import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export type MatchResult = {
    id: number // Match ID
    user: {
        id: number
        fullName: string
        email: string
        specialty: { name: string }
        currentZone: { name: string }
    }
    targetZones: { id: number, name: string }[]
    matchDate: Date
    completedAt?: Date | null
    status: string // "active" | "inactive"
    rank: number
}

export async function findMatches(profileId: number): Promise<MatchResult[]> {
    const userProfile = await prisma.profile.findUnique({
        where: { id: profileId },
        include: {
            user: true,
            currentZone: true,
            transferRequest: {
                include: {
                    targetZones: true
                }
            }
        }
    })

    if (!userProfile || !userProfile.transferRequest) {
        return []
    }

    const userRequest = userProfile.transferRequest
    const userTargetZoneIds = userRequest.targetZones.map(tz => tz.zoneId)

    // 1. Check for ALL existing matches in DB (Active & Inactive)
    const existingMatches = await (prisma as any).match.findMany({
        where: {
            // status: "active", // REMOVED: Fetch all to show history
            participants: {
                some: {
                    requestId: userRequest.id
                }
            }
        },
        include: {
            participants: {
                include: {
                    request: {
                        include: {
                            targetZones: {
                                include: { zone: true }
                            },
                            profile: {
                                include: {
                                    user: true,
                                    specialty: true,
                                    currentZone: true
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedExistingMatches = existingMatches.map((match: any) => {
        // Find the "other" participant
        const otherParticipant = match.participants.find((p: any) => p.requestId !== userRequest.id)
        if (!otherParticipant) return null

        const otherProfile = otherParticipant.request.profile
        return {
            id: match.id,
            user: {
                id: otherProfile.userId,
                fullName: otherProfile.user.fullName,
                email: otherProfile.user.email,
                specialty: { name: otherProfile.specialty.name },
                currentZone: { name: otherProfile.currentZone.name }
            },
            // Calculate Rank: Where IS the current user in the OTHER person's target list?
            // We know `otherParticipant.request.targetZones` contains the zones effectively.
            // But wait, `targetZones` in the result is `otherParticipant.request.targetZones`.
            // We need to find `userProfile.currentZoneId` in `otherParticipant.request.targetZones`.
            targetZones: otherParticipant.request.targetZones.map((tz: any) => ({ id: tz.zone.id, name: tz.zone.name })),
            matchDate: match.createdAt,
            completedAt: match.completedAt,
            status: match.status,
            rank: (() => {
                const target = otherParticipant.request.targetZones.find((tz: any) => tz.zoneId === userProfile.currentZoneId)
                return target ? target.priorityOrder : 0
            })()
        }
    }).filter(Boolean) as MatchResult[]

    // Check if we have any ACTIVE matches
    const hasActiveMatches = formattedExistingMatches.some(m => m.status === 'active')

    if (hasActiveMatches) {
        // If we have active matches, we just return all matches (active + history)
        // We do NOT run the algorithm to find new ones to avoid duplicate/spam matches for now.
        return formattedExistingMatches
    }

    // 2. If no active matches, run algorithm to find NEW matches
    const potentialMatches = await prisma.profile.findMany({
        where: {
            id: { not: profileId }, // Not self
            specialtyId: userProfile.specialtyId,
            divisionId: userProfile.divisionId,
            currentZoneId: { in: userTargetZoneIds }, // They are in where we want to go
            transferRequest: {
                status: "active",
                targetZones: {
                    some: {
                        zoneId: userProfile.currentZoneId // We are where they want to go
                    }
                }
            }
        },
        include: {
            user: true,
            currentZone: true,
            specialty: true,
            transferRequest: {
                include: {
                    targetZones: {
                        include: { zone: true }
                    }
                }
            }
        }
    })

    const newMatches: MatchResult[] = []

    for (const matchProfile of potentialMatches) {
        if (!matchProfile.transferRequest) continue

        // Check if we already matched with this request (in inactive history) - optional check?
        // For now, if it's new run of algorithm, we assume it's valid to match again if conditions are met?
        // Or should we avoid re-matching the same person if we have an inactive match?
        // Let's check `existingMatches` for this participant.
        const alreadyMatched = existingMatches.some((em: any) =>
            em.participants.some((p: any) => p.requestId === matchProfile.transferRequest!.id)
        )

        if (alreadyMatched) continue; // Skip if we already have a match record (even inactive)

        // Create the match in DB
        let matchId = 0;
        let createdAt = new Date();

        await prisma.$transaction(async (tx) => {
            const newMatch = await (tx as any).match.create({
                data: {
                    type: "direct",
                    status: "active",
                }
            })
            matchId = newMatch.id
            createdAt = newMatch.createdAt

            await (tx as any).matchParticipant.createMany({
                data: [
                    { matchId: newMatch.id, requestId: userRequest.id },
                    { matchId: newMatch.id, requestId: matchProfile.transferRequest!.id }
                ]
            })
        })

        newMatches.push({
            id: matchId,
            user: {
                id: matchProfile.userId,
                fullName: matchProfile.user.fullName,
                email: matchProfile.user.email,
                specialty: { name: matchProfile.specialty.name },
                currentZone: { name: matchProfile.currentZone.name }
            },
            targetZones: matchProfile.transferRequest.targetZones.map(tz => ({ id: tz.zone.id, name: tz.zone.name })),
            matchDate: createdAt,
            completedAt: null,
            status: "active",
            rank: (() => {
                const target = matchProfile.transferRequest!.targetZones.find(t => t.zoneId === userProfile.currentZoneId)
                return target ? target.priorityOrder : 0
            })()
        })
    }

    // Return Combined List
    return [...formattedExistingMatches, ...newMatches]
}
