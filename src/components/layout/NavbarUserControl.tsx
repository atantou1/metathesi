"use client"

import Link from "next/link"
import { User as UserIcon, Settings, LogOut } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserNavLogout } from "@/components/layout/user-nav-logout"
import { ThemeToggleClient } from "@/components/layout/ThemeToggleClient"
import { useUser } from "@/components/providers/user-context"
import { Session } from "next-auth"

export function NavbarUserControl({ session }: { session: Session }) {
    const { name, avatarColor } = useUser()
    
    // Fallback to session name if context name is empty (initial load)
    const displayName = name || session.user?.name || "User"

    return (
        <div className="hidden sm:block">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-3 pl-2 cursor-pointer group outline-none">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-semibold text-foreground dark:text-white group-hover:text-primary transition-colors">
                                {displayName}
                            </span>
                            <span className="text-xs text-text-tertiary font-medium bg-muted dark:bg-muted px-2 py-0.5 rounded-full mt-0.5">
                                {session.user?.email}
                            </span>
                        </div>
                        <div className={`w-10 h-10 rounded-full ${avatarColor} overflow-hidden border-2 border-transparent group-hover:border-primary transition-all flex items-center justify-center`}>
                            <Avatar className="w-full h-full border-none">
                                <AvatarImage src={session.user?.image || undefined} />
                                <AvatarFallback className="bg-transparent text-white font-bold">
                                    {displayName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 bg-card rounded-2xl border border-border shadow-floating">

                    {/* My Account (Non-clickable) */}
                    <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-muted hover:text-primary transition-colors cursor-default">
                        <UserIcon className="w-5 h-5" />
                        Ο Λογαριασμός μου
                    </div>

                    <div className="h-px bg-border-dim my-1"></div>

                    {/* Settings (Clickable) */}
                    <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                        <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-muted hover:text-primary transition-colors cursor-pointer w-full">
                            <Settings className="w-5 h-5" />
                            Ρυθμίσεις
                        </Link>
                    </DropdownMenuItem>

                    <div className="h-px bg-border-dim my-1"></div>

                    {/* Light/Dark Toggle */}
                    <ThemeToggleClient />

                    <div className="h-px bg-border-dim my-1"></div>

                    {/* Logout */}
                    <UserNavLogout />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
