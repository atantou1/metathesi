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



    if (!hasUnread) return null;

    const handleBellClick = () => {
        router.push("/matches")
    }

    return (
        <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleBellClick}
            className="relative rounded-full transition-all duration-300 text-foreground dark:text-white hover:bg-muted dark:hover:bg-muted/50 hover:text-primary animate-in fade-in zoom-in-90 duration-300"
            title="Προβολή ειδοποιήσεων"
        >
            <Bell className="w-5 h-5 fill-primary/10" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-background dark:ring-card animate-pulse"></span>
        </Button>
    )
}
