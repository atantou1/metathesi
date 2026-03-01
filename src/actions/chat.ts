"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/actions/notifications"

export async function getMatchMessages(matchId: number) {
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

    // Verify user is part of the match
    // Note: Due to Prisma's dynamic generation, we use type assertions if needed
    const match = await (prisma as any).match.findUnique({
        where: { id: matchId },
        include: {
            participants: {
                include: {
                    request: {
                        select: { profileId: true }
                    }
                }
            }
        }
    })

    if (!match) {
        throw new Error("Match not found")
    }

    const isParticipant = match.participants.some((p: any) => p.request.profileId === profile.id)
    if (!isParticipant) {
        throw new Error("Unauthorized access to match chat")
    }

    // Fetch messages
    const messages = await (prisma as any).message.findMany({
        where: { matchId },
        orderBy: { createdAt: 'asc' },
        include: {
            senderProfile: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true
                        }
                    }
                }
            }
        }
    })

    return messages
}

export async function sendMessage(matchId: number, content: string) {
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

    // Verify user is part of the match and match is active
    const match = await (prisma as any).match.findUnique({
        where: { id: matchId },
        include: {
            participants: {
                include: {
                    request: {
                        select: { profileId: true }
                    }
                }
            }
        }
    })

    if (!match) {
        throw new Error("Match not found")
    }

    if (match.status !== "active") {
        throw new Error("Cannot send message to inactive match")
    }

    const isParticipant = match.participants.some((p: any) => p.request.profileId === profile.id)
    if (!isParticipant) {
        throw new Error("Unauthorized access to match chat")
    }

    if (!content || content.trim().length === 0) {
        throw new Error("Message content cannot be empty")
    }

    const message = await (prisma as any).message.create({
        data: {
            matchId,
            senderProfileId: profile.id,
            content: content.trim()
        },
        include: {
            senderProfile: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true
                        }
                    }
                }
            }
        }
    })

    // Notify the *other* participant of the match
    const otherParticipant = match.participants.find((p: any) => p.request.profileId !== profile.id);
    if (otherParticipant) {
        await createNotification(otherParticipant.request.profileId, matchId, 'NEW_MESSAGE');
    }

    return message
}
