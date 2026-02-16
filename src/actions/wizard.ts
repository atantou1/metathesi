"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function submitWizardRequest(data: any) {
    const session = await auth()
    if (!session?.user?.email) {
        return { error: "Unauthenticated" }
    }

    const { divisionId, specialtyId, currentZoneId, targetZoneIds } = data

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) return { error: "User not found" }

        await prisma.$transaction(async (tx) => {
            // 1. Create or Update Profile
            // Casting to any to avoid stale IDE errors regarding fullName which definitely exists
            const updateData = {
                fullName: data.fullName, // Update Profile Name
                divisionId: Number(divisionId),
                specialtyId: Number(specialtyId),
                currentZoneId: Number(currentZoneId)
            } as any

            const createData = {
                userId: user.id,
                fullName: data.fullName,
                divisionId: Number(divisionId),
                specialtyId: Number(specialtyId),
                currentZoneId: Number(currentZoneId)
            } as any

            await tx.profile.upsert({
                where: { userId: user.id },
                update: updateData,
                create: createData
            })

            // Optionally sync User's fullName if they are the same concept
            if (data.fullName) {
                await tx.user.update({
                    where: { id: user.id },
                    data: { fullName: data.fullName }
                })
            }

            // Get profile ID (just updated/created)
            const profile = await tx.profile.findUniqueOrThrow({
                where: { userId: user.id }
            })

            // 2. Handle Transfer Request
            const existingRequest = await tx.transferRequest.findFirst({
                where: {
                    profileId: profile.id,
                    status: 'active'
                }
            })

            if (existingRequest) {
                // If requestId provided matches existing, it's an UPDATE
                if (data.requestId && Number(data.requestId) === existingRequest.id) {
                    // Clear old targets
                    await tx.targetZone.deleteMany({
                        where: { requestId: existingRequest.id }
                    })

                    // Add new targets
                    if (targetZoneIds.length > 0) {
                        await tx.targetZone.createMany({
                            data: targetZoneIds.map((zoneId: number, index: number) => ({
                                requestId: existingRequest.id,
                                zoneId: Number(zoneId),
                                priorityOrder: index + 1
                            }))
                        })
                    }

                    // Ensure active (just in case)
                    await tx.transferRequest.update({
                        where: { id: existingRequest.id },
                        data: { status: 'active' }
                    })
                } else {
                    // Block creation if active exists and we are not editing it
                    throw new Error("Υπάρχει ήδη ενεργή αίτηση. Πρέπει να τη διαγράψετε για να υποβάλετε νέα.")
                }
            } else {
                // Create new request
                const newRequest = await tx.transferRequest.create({
                    data: {
                        profileId: profile.id,
                        status: 'active'
                    }
                })

                if (targetZoneIds.length > 0) {
                    await tx.targetZone.createMany({
                        data: targetZoneIds.map((zoneId: number, index: number) => ({
                            requestId: newRequest.id,
                            zoneId: Number(zoneId),
                            priorityOrder: index + 1
                        }))
                    })
                }
            }
        })

        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Wizard Error:", error)
        return { error: "Failed to submit request" }
    }
}
