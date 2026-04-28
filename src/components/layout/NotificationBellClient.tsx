"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { getUnreadNotifications, markNotificationAsRead } from "@/actions/notifications"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

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
        <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleBellClick}
            className={`relative rounded-full transition-all duration-300 ${hasUnread
                ? "text-foreground dark:text-white hover:bg-muted dark:hover:bg-muted/50 hover:text-primary"
                : "text-text-tertiary cursor-default opacity-70"
                }`}
            title={hasUnread ? "Προβολή ειδοποιήσεων" : "Δεν υπάρχουν νέες ειδοποιήσεις"}
        >
            <Bell className="w-5 h-5" />
            {hasUnread && (
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-background dark:ring-card animate-pulse"></span>
            )}
        </Button>
    )
}
