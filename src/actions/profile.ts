"use server"

import { DivisionType } from "@prisma/client"
import { auth } from "@/auth"
import { profileSchema, ProfileValues } from "@/lib/schemas"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export async function getDivisions() {
    return await prisma.division.findMany()
}

export async function getSpecialties(divisionId: number) {
    const division = await prisma.division.findUnique({
        where: { id: divisionId },
    })

    if (!division) return []

    // Logic from specs:
    // If Division contains "Πρωτοβάθμια", show is_primary=true
    // If Division contains "Δευτεροβάθμια", show is_secondary=true
    // Actually, specs say "Division name contains..."

    const isPrimary = division.name.includes("Πρωτοβάθμια");
    const isSecondary = division.name.includes("Δευτεροβάθμια");

    if (isPrimary) {
        return await prisma.specialty.findMany({ where: { isPrimary: true } })
    }
    if (isSecondary) {
        return await prisma.specialty.findMany({ where: { isSecondary: true } })
    }
    return []
}

export async function getRegions() {
    return await prisma.region.findMany()
}

export async function getZones(regionId: number, divisionId: number) {
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

export async function createProfile(values: ProfileValues) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Δεν είστε συνδεδεμένοι." }
    }

    const validatedFields = profileSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Μη έγκυρα δεδομένα." }
    }

    const { divisionId, specialtyId, currentZoneId, bio } = validatedFields.data
    const userId = parseInt(session.user.id)

    try {
        await prisma.profile.create({
            data: {
                userId,
                divisionId,
                specialtyId,
                currentZoneId,
                bio,
            }
        })
    } catch (error) {
        console.error("Profile creation error:", error)
        return { error: "Η δημιουργία προφίλ απέτυχε." }
    }

    redirect("/request/create")
}
