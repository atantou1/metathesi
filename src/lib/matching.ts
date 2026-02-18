import { prisma } from "./prisma"
import { Prisma } from "@prisma/client"

export async function validateActiveMatches(requestId: number, tx: Prisma.TransactionClient) {
    // 1. Find all ACTIVE matches involving this request
    const activeMatches = await (tx as any).match.findMany({
        where: {
            status: "active",
            participants: {
                some: {
                    requestId: requestId
                }
            }
        },
        include: {
            participants: {
                include: {
                    request: {
                        include: {
                            targetZones: true
                        }
                    }
                }
            }
        }
    })

    const now = new Date()

    for (const match of activeMatches) {
        // Assume 2-way match for now
        if (match.participants.length !== 2) {
            console.warn(`Match ${match.id} has ${match.participants.length} participants. Skipping validation (only 2-way supported).`)
            continue
        }

        const p1 = match.participants[0]
        const p2 = match.participants[1]

        const r1 = p1.request
        const r2 = p2.request

        // Check if R1 wants R2's origin
        // @ts-ignore
        const r1WantsR2 = r1.targetZones.some((tz: any) => tz.zoneId === r2.originZoneId)

        // Check if R2 wants R1's origin
        // @ts-ignore
        const r2WantsR1 = r2.targetZones.some((tz: any) => tz.zoneId === r1.originZoneId)

        const isValid = r1WantsR2 && r2WantsR1

        if (!isValid) {
            console.log(`Match ${match.id} is no longer valid. Invalidating...`)
            await (tx as any).match.update({
                where: { id: match.id },
                data: {
                    status: "inactive",
                    completedAt: now
                }
            })
        }
    }
}

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
            // @ts-ignore - Prisma relation config issue
            transferRequests: {
                // Fetch ALL requests to get full history, not just active
                include: {
                    targetZones: true
                }
            }
        }
    })

    if (!userProfile) {
        return []
    }

    // @ts-ignore
    const allRequests = userProfile.transferRequests || []
    const allRequestIds = allRequests.map((r: any) => r.id)

    // @ts-ignore
    const activeRequest = allRequests.find((r: any) => r.status === 'active')

    // 1. Check for ALL existing matches in DB (Active & Inactive) for ANY of user's requests
    const existingMatches = await (prisma as any).match.findMany({
        where: {
            participants: {
                some: {
                    requestId: { in: allRequestIds }
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
        const otherParticipant = match.participants.find((p: any) => !allRequestIds.includes(p.requestId))
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
            targetZones: otherParticipant.request.targetZones.map((tz: any) => ({ id: tz.zone.id, name: tz.zone.name })),
            matchDate: match.createdAt,
            completedAt: match.completedAt,
            status: match.status,
            rank: (() => {
                // Find USER'S participant to get the origin they had AT THAT TIME (stored in request)
                const userParticipant = match.participants.find((p: any) => allRequestIds.includes(p.requestId))
                // Default to profile currentZone if request not found (shouldn't happen) or origin missing
                const myOriginId = userParticipant?.request?.originZoneId || userProfile.currentZoneId

                const target = otherParticipant.request.targetZones.find((tz: any) => tz.zoneId === myOriginId)
                return target ? target.priorityOrder : 0
            })()
        }
    }).filter(Boolean) as MatchResult[]

    // Check if we have any ACTIVE matches
    const hasActiveMatches = formattedExistingMatches.some(m => m.status === 'active')

    if (hasActiveMatches) {
        // If we have active matches, we just return all matches (active + history)
        return formattedExistingMatches
    }

    // IF NO ACTIVE REQUEST, WE CANNOT FIND NEW MATCHES
    if (!activeRequest) {
        return formattedExistingMatches
    }

    const userRequest = activeRequest
    const userTargetZoneIds = userRequest.targetZones.map((tz: any) => tz.zoneId)
    // Use originZoneId from the request, falling back to currentZoneId if not set
    // @ts-ignore
    const userOriginZoneId = userRequest.originZoneId || userProfile.currentZoneId

    // 2. If no active matches AND we have an active request, run algorithm to find NEW matches
    const potentialMatches = await prisma.profile.findMany({
        where: {
            id: { not: profileId }, // Not self
            specialtyId: userProfile.specialtyId,
            divisionId: userProfile.divisionId,
            // @ts-ignore
            transferRequests: {
                some: {
                    status: "active",
                    // The other person's ORIGIN must be one of my TARGETS
                    originZoneId: { in: userTargetZoneIds },
                    targetZones: {
                        some: {
                            // The other person's TARGET must be my ORIGIN
                            zoneId: userOriginZoneId // We are where they want to go
                        }
                    }
                }
            }
        },
        include: {
            user: true,
            currentZone: true,
            specialty: true,
            // @ts-ignore
            transferRequests: {
                where: { status: 'active' },
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
        // @ts-ignore
        const matchRequest = matchProfile.transferRequests[0]
        if (!matchRequest) continue

        // Check if we already have an ACTIVE match with this request
        const alreadyMatched = existingMatches.some((em: any) =>
            em.status === 'active' &&
            em.participants.some((p: any) => p.requestId === matchRequest.id)
        )

        if (alreadyMatched) continue; // Skip if we already have an ACTIVE match

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
                    { matchId: newMatch.id, requestId: matchRequest.id }
                ]
            })
        })

        newMatches.push({
            id: matchId,
            user: {
                id: matchProfile.userId,
                fullName: (matchProfile as any).user.fullName,
                email: (matchProfile as any).user.email,
                specialty: { name: (matchProfile as any).specialty.name },
                currentZone: { name: (matchProfile as any).currentZone.name }
            },
            targetZones: matchRequest.targetZones.map((tz: any) => ({ id: tz.zone.id, name: tz.zone.name })),
            matchDate: createdAt,
            completedAt: null,
            status: "active",
            rank: (() => {
                const target = matchRequest.targetZones.find((t: any) => t.zoneId === userOriginZoneId)
                return target ? target.priorityOrder : 0
            })()
        })
    }

    // Return Combined List
    return [...formattedExistingMatches, ...newMatches]
}
