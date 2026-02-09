"use server"

import { DivisionType, Prisma } from "@prisma/client"
import { auth } from "@/auth"
import { requestSchema, RequestValues } from "@/lib/schemas"
import { redirect } from "next/navigation"
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

    try {
        // Transaction to create request and target zones
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Check if active request exists?
            // Specs say "can create transfer request". Maybe update existing?
            // For Phase 1, assume 1 active request per user.
            // Let's delete existing active request if any
            const existing = await tx.transferRequest.findUnique({
                where: { profileId: profile.id },
            })

            if (existing) {
                // Optionally update or delete. Let's delete to overwrite.
                await tx.targetZone.deleteMany({ where: { requestId: existing.id } })
                await tx.transferRequest.delete({ where: { id: existing.id } })
            }

            const request = await tx.transferRequest.create({
                data: {
                    profileId: profile.id,
                    status: "active",
                }
            })

            // Create target zones with priority (order in array)
            await Promise.all(targetZoneIds.map((zoneId, index) => {
                return tx.targetZone.create({
                    data: {
                        requestId: request.id,
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

    redirect("/dashboard") // Or wherever appropriate
}
