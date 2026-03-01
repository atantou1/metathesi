"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

/**
 * Fetch all unread notifications for the current user's profile
 */
export async function getUnreadNotifications() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const userId = parseInt(session.user.id)
    const profile = await prisma.profile.findUnique({
        where: { userId }
    })

    if (!profile) {
        throw new Error("Profile not found")
    }

    // Since we've just added this to Prisma, use type assertion to bypass immediate type check errors
    const notifications = await (prisma as any).notification.findMany({
        where: {
            profileId: profile.id,
            isRead: false
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return notifications
}

/**
 * Mark a specific notification as read, usually triggered when clicking on it
 */
export async function markNotificationAsRead(notificationId: number) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const userId = parseInt(session.user.id)
    const profile = await prisma.profile.findUnique({
        where: { userId }
    })

    if (!profile) {
        throw new Error("Profile not found")
    }

    const notification = await (prisma as any).notification.update({
        where: {
            id: notificationId,
            profileId: profile.id // Security check to ensure the user owns this notification
        },
        data: {
            isRead: true
        }
    })

    return notification
}

/**
 * Triggered internally by other actions to create a notification
 */
export async function createNotification(profileId: number, matchId: number, type: 'NEW_MATCH' | 'NEW_MESSAGE') {
    // Avoid await block here to not strictly fail if it's slow
    return (prisma as any).notification.create({
        data: {
            profileId,
            matchId,
            type
        }
    })
}
