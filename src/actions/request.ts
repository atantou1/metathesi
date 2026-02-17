"use server"

import { DivisionType, Prisma, RequestStatus } from "@prisma/client"
import { auth } from "@/auth"
import { requestSchema, RequestValues } from "@/lib/schemas"
import { prisma } from "@/lib/prisma"

export async function getUserProfile() {
    const session = await auth()
    if (!session?.user?.id) return null

    const userId = parseInt(session.user.id)
    return await prisma.profile.findUnique({
        where: { userId },
        include: {
            currentZone: true,
            division: true,
            specialty: true,
            // We might want to include active transfer request here if needed
        }
    })
}

export async function getAvailableZones(regionId: number, divisionId: number) {
    // Same as getZones but we can reuse logic or import it
    // For now, duplicate for simplicity
    const division = await prisma.division.findUnique({
        where: { id: divisionId },
    })

    if (!division) return []

    const isPrimary = division.name.includes("Πρωτοβάθμια");
    const divisionType = isPrimary ? DivisionType.Primary : DivisionType.Secondary

    return await prisma.postingZone.findMany({
        where: {
            regionId,
            divisionType,
        }
    })
}

export async function createTransferRequest(values: RequestValues) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Δεν είστε συνδεδεμένοι." }
    }

    const userId = parseInt(session.user.id)
    const profile = await prisma.profile.findUnique({ where: { userId } })

    if (!profile) {
        return { error: "Δεν βρέθηκε προφίλ." }
    }

    const validatedFields = requestSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Μη έγκυρα δεδομένα." }
    }

    const { targetZoneIds } = validatedFields.data

    // Validate: Target zone cannot be current zone
    if (targetZoneIds.includes(profile.currentZoneId)) {
        return { error: "Η περιοχή οργανικής δεν μπορεί να είναι περιοχή μετάθεσης." }
    }

    // Check for existing ACTIVE request
    const existingActive = await prisma.transferRequest.findFirst({
        where: {
            profileId: profile.id,
            status: 'active'
        },
    })

    if (existingActive) {
        return { error: "Υπάρχει ήδη ενεργή αίτηση. Πρέπει να τη διαγράψετε για να υποβάλετε νέα." }
    }

    try {
        // Transaction to create request and target zones
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Create NEW request
            const request = await tx.transferRequest.create({
                data: {
                    profileId: profile.id,
                    // @ts-ignore
                    originZoneId: profile.currentZoneId,
                    status: RequestStatus.active,
                }
            })
            const requestId = request.id

            // Create target zones with priority (order in array)
            await Promise.all(targetZoneIds.map((zoneId, index) => {
                return tx.targetZone.create({
                    data: {
                        requestId,
                        zoneId,
                        priorityOrder: index + 1,
                    }
                })
            }))
        })
    } catch (error) {
        console.error("Request creation error:", error)
        return { error: "Η υποβολή αίτησης απέτυχε." }
    }

    // We don't redirect here anymore, we returning success to show the message
    return { success: true }
}

export async function getTransferRequest() {
    const session = await auth()
    if (!session?.user?.id) return null

    const userId = parseInt(session.user.id)
    const profile = await prisma.profile.findUnique({ where: { userId } })
    if (!profile) return null

    const request = await prisma.transferRequest.findFirst({
        where: {
            profileId: profile.id,
            status: 'active'
        },
        include: {
            targetZones: {
                include: {
                    zone: true
                },
                orderBy: {
                    priorityOrder: 'asc'
                }
            }
        }
    })

    if (!request) return null

    return request
}

export async function deleteTransferRequest() {
    const session = await auth()
    if (!session?.user?.id) return { error: "Δεν είστε συνδεδεμένοι." }

    const userId = parseInt(session.user.id)
    const profile = await prisma.profile.findUnique({ where: { userId } })
    if (!profile) return { error: "Δεν βρέθηκε προφίλ." }

    try {
        const existing = await prisma.transferRequest.findFirst({
            where: {
                profileId: profile.id,
                status: 'active'
            },
        })

        if (!existing) return { error: "Δεν βρέθηκε αίτηση." }

        await prisma.$transaction(async (tx) => {
            const now = new Date()

            // 1. Invalidate active matches linked to this request
            await (tx as any).match.updateMany({
                where: {
                    status: "active",
                    participants: {
                        some: {
                            requestId: existing.id
                        }
                    }
                },
                data: {
                    status: "inactive",
                    completedAt: now
                }
            })

            // 2. Do NOT delete participants or target zones yet to keep history in DB?
            // User requested "Delete" visually removes the frame.
            // But we keep the record as inactive.

            // 3. Mark request as inactive (Soft Delete)
            await tx.transferRequest.update({
                where: { id: existing.id },
                data: {
                    status: RequestStatus.inactive,
                    // @ts-ignore
                    completedAt: now
                }
            })
        })

        return { success: true }
    } catch (error) {
        console.error("Delete request error:", error)
        return { error: "Η διαγραφή απέτυχε." }
    }
}

export async function updateTransferRequest(values: RequestValues) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Δεν είστε συνδεδεμένοι." }

    const userId = parseInt(session.user.id)
    const profile = await prisma.profile.findUnique({ where: { userId } })
    if (!profile) return { error: "Δεν βρέθηκε προφίλ." }

    const validatedFields = requestSchema.safeParse(values)
    if (!validatedFields.success) return { error: "Μη έγκυρα δεδομένα." }

    const { targetZoneIds } = validatedFields.data

    if (targetZoneIds.includes(profile.currentZoneId)) {
        return { error: "Η περιοχή οργανικής δεν μπορεί να είναι περιοχή μετάθεσης." }
    }

    const existing = await prisma.transferRequest.findFirst({
        where: {
            profileId: profile.id,
            status: 'active'
        },
    })

    if (!existing) return { error: "Δεν βρέθηκε αίτηση προς επεξεργασία." }

    try {
        await prisma.$transaction(async (tx) => {
            const now = new Date()

            // 1. Invalidate any existing active matches as the request criteria changed
            await (tx as any).match.updateMany({
                where: {
                    status: "active",
                    participants: {
                        some: {
                            requestId: existing.id
                        }
                    }
                },
                data: {
                    status: "inactive",
                    completedAt: now
                }
            })

            // 2. Delete existing target zones
            await tx.targetZone.deleteMany({
                where: { requestId: existing.id }
            })

            // 3. Create new target zones
            await Promise.all(targetZoneIds.map((zoneId, index) => {
                return tx.targetZone.create({
                    data: {
                        requestId: existing.id,
                        zoneId,
                        priorityOrder: index + 1,
                    }
                })
            }))

            // 4. Update request status/timestamp/origin if needed
            // Ensure status is active in case it was inactive
            await tx.transferRequest.update({
                where: { id: existing.id },
                data: {
                    status: RequestStatus.active,
                    // @ts-ignore
                    originZoneId: profile.currentZoneId, // Sync origin in case user moved
                    // @ts-ignore
                    completedAt: null // clear completion if we are updating/reactivating
                }
            })
        })

        return { success: true }
    } catch (error) {
        console.error("Update request error:", error)
        return { error: "Η ενημέρωση απέτυχε." }
    }
}
