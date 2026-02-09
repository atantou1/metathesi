import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export type MatchResult = Prisma.ProfileGetPayload<{
    include: {
        user: {
            select: {
                email: true,
                fullName: true,
            }
        },
        currentZone: true,
        transferRequest: {
            include: {
                targetZones: {
                    include: {
                        zone: true
                    }
                }
            }
        }
    }
}>

export async function findMatches(profileId: number): Promise<MatchResult[]> {
    // 1. Fetch current user's full profile and request
    const currentUserProfile = await prisma.profile.findUnique({
        where: { id: profileId },
        include: {
            transferRequest: {
                where: { status: 'active' },
                include: {
                    targetZones: true
                }
            }
        }
    })

    if (!currentUserProfile || !currentUserProfile.transferRequest) {
        return [] // No profile or no active request, so no matches
    }

    const currentRequest = currentUserProfile.transferRequest

    // If user has no active request, they can't match
    if (!currentRequest) return []

    const myCurrentZoneId = currentUserProfile.currentZoneId
    const myTargetZoneIds = currentRequest.targetZones.map(tz => tz.zoneId)

    // 2. Find potential matches
    // Criteria:
    // - Same Specialty
    // - Same Division
    // - Their Current Zone is in My Target Zones
    // - My Current Zone is in Their Target Zones
    // - They have an active request

    const matches = await prisma.profile.findMany({
        where: {
            id: { not: profileId }, // Exclude self
            specialtyId: currentUserProfile.specialtyId, // 1. Same Specialty
            divisionId: currentUserProfile.divisionId,   // 2. Same Division
            currentZoneId: { in: myTargetZoneIds },      // 3. Their Current is My Target
            transferRequest: {
                status: 'active',
                targetZones: {
                    some: {
                        zoneId: myCurrentZoneId          // 4. My Current is Their Target
                    }
                }
            }
        },
        include: {
            user: {
                select: {
                    email: true,
                    fullName: true,
                }
            },
            currentZone: true,
            transferRequest: {
                include: {
                    targetZones: {
                        include: {
                            zone: true
                        }
                    }
                }
            }
        }
    })

    return matches as MatchResult[]
}
