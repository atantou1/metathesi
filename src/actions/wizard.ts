"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getGenderFromName, getRandomColorForGender } from "@/lib/avatar-utils"
import { revalidatePath } from "next/cache"
import { validateActiveMatches, findMatches } from "@/lib/matching"

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

        let profileId: number | undefined

        await prisma.$transaction(async (tx) => {
            // ... (existing code up to profile fetch)
            // 1. Create or Update Profile
            const updateData = {
                divisionId: Number(divisionId),
                specialtyId: Number(specialtyId),
                currentZoneId: Number(currentZoneId)
            }

            const createData = {
                userId: user.id,
                divisionId: Number(divisionId),
                specialtyId: Number(specialtyId),
                currentZoneId: Number(currentZoneId)
            }

            await tx.profile.upsert({
                where: { userId: user.id },
                update: updateData,
                create: createData
            })

            // Update User's fullName (Single source of truth)
            if (data.fullName) {
                const updatePayload: any = { fullName: data.fullName }
                
                // If user doesn't have an avatar color yet, assign a random one
                if (!user.avatarColor) {
                    const gender = getGenderFromName(data.fullName)
                    updatePayload.avatarColor = getRandomColorForGender(gender)
                }

                await tx.user.update({
                    where: { id: user.id },
                    data: updatePayload
                })
            }



            // Get profile ID (just updated/created)
            const profile = await tx.profile.findUniqueOrThrow({
                where: { userId: user.id }
            })
            profileId = profile.id

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
                        data: {
                            status: 'active',
                            // @ts-ignore
                            originZoneId: profile.currentZoneId
                        }
                    })

                    // Validate existing matches
                    await validateActiveMatches(existingRequest.id, tx)

                    // Check for NEW matches
                    // We must run this OUTSIDE the transaction if findMatches uses its own transaction or read/write logic that conflicts?
                    // Actually `findMatches` does not take a TX, it uses `prisma` global. 
                    // Mixing tx and global prisma might be an issue if we are in a TX here.
                    // `findMatches` reads from DB. If we just updated DB in `tx`, `findMatches` (using global prisma) might NOT see the changes if `tx` is not committed yet!
                    // SO we should run `findMatches` AFTER the transaction commits.
                } else {
                    // Block creation if active exists and we are not editing it
                    throw new Error("Υπάρχει ήδη ενεργή αίτηση. Πρέπει να τη διαγράψετε για να υποβάλετε νέα.")
                }
            } else {
                // Create new request
                const newRequest = await tx.transferRequest.create({
                    data: {
                        profileId: profile.id,
                        // @ts-ignore
                        originZoneId: profile.currentZoneId,
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

        // 3. Trigger Match Search (Outside transaction to see committed data)
        if (profileId) {
            await findMatches(profileId)
        }

        revalidatePath("/dashboard")
        return { 
            success: true, 
            avatarColor: (await prisma.user.findUnique({ where: { email: session.user.email }, select: { avatarColor: true } }))?.avatarColor 
        }

    } catch (error) {
        console.error("Wizard Error:", error)
        return { error: "Failed to submit request" }
    }
}
