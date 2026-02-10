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
    status: string // "active" | "inactive"
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

    // 1. Check for EXISTING ACTIVE matches in DB
    const existingMatches = await prisma.match.findMany({
        where: {
            status: "active",
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
        }
    })

    if (existingMatches.length > 0) {
        // Return existing matches formatted as MatchResult
        return existingMatches.map(match => {
            // Find the "other" participant
            const otherParticipant = match.participants.find(p => p.requestId !== userRequest.id)
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
                targetZones: otherParticipant.request.targetZones.map(tz => ({ id: tz.zone.id, name: tz.zone.name })),
                matchDate: match.createdAt,
                status: match.status
            }
        }).filter(Boolean) as MatchResult[]
    }

    // 2. If no existing matches, run algorithm to find NEW matches
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

        // Create the match in DB
        let matchId = 0;
        await prisma.$transaction(async (tx) => {
            const newMatch = await (tx as any).match.create({
                data: {
                    type: "direct",
                    status: "active",
                }
            })
            matchId = newMatch.id

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
            matchDate: new Date(),
            status: "active"
        })
    }

    return newMatches
}
