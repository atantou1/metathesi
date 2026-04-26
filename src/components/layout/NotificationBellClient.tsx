"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { getUnreadNotifications, markNotificationAsRead } from "@/actions/notifications"
import { useRouter } from "next/navigation"

type NotificationType = {
    id: number
    type: string
    matchId: number
    isRead: boolean
}

export function NotificationBellClient() {
    const [notifications, setNotifications] = useState<NotificationType[]>([])
    const router = useRouter()

    useEffect(() => {
        let isMounted = true
        const fetchNotifications = async () => {
            try {
                const unread = await getUnreadNotifications() // Returns recent unread
                if (isMounted) {
                    setNotifications(unread)
                }
            } catch (error) {
                console.error("Failed to fetch notifications", error)
            }
        }

        fetchNotifications()
        // Poll for new notifications every 10 seconds
        const interval = setInterval(fetchNotifications, 10000)
        return () => {
            isMounted = false
            clearInterval(interval)
        }
    }, [])

    const hasUnread = notifications.length > 0

    const handleBellClick = async () => {
        if (!hasUnread) return // Do nothing if there are no new matches/messages

        // Take the latest notification
        const latest = notifications[0]

        try {
            // Mark all notifications for this match as read
            const relatedNotifications = notifications.filter(n => n.matchId === latest.matchId);
            for (const notif of relatedNotifications) {
                await markNotificationAsRead(notif.id)
            }

            // Navigate to matches page, optionally opening the specific chat
            router.push(`/matches?openChat=${latest.matchId}`)

            // Optimistically clear the read notifications from state
            setNotifications(prev => prev.filter(n => n.matchId !== latest.matchId))

        } catch (error) {
            console.error("Failed to mark notification as read", error)
        }
    }

    return (
        <button
            onClick={handleBellClick}
            className={`relative p-2 transition-colors ${hasUnread
                    ? "text-foreground dark:text-white cursor-pointer hover:bg-muted dark:hover:bg-muted rounded-full"
                    : "text-text-quaternary dark:text-text-quaternary cursor-default"
                }`}
        >
            <Bell className="w-6 h-6" />
            {hasUnread && (
                <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-card animate-pulse"></span>
            )}
        </button>
    )
}
