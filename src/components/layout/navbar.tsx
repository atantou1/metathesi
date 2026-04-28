
import Link from "next/link"
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { User as UserIcon, Settings, FileText, LogOut } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainNav } from "@/components/layout/main-nav"
import { UserNavLogout } from "@/components/layout/user-nav-logout"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { NotificationBellClient } from "@/components/layout/NotificationBellClient"
import { Logo } from "@/components/logo"
import { FloatingNavWrapper } from "@/components/layout/floating-nav-wrapper"
import { ThemeToggleClient } from "@/components/layout/ThemeToggleClient"
import { ModeToggle } from "@/components/layout/ModeToggle"

export async function Navbar() {
    const session = await auth()

    return (
        <FloatingNavWrapper>
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                        <Logo className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold tracking-tight hidden sm:block">
                            <span className="text-foreground dark:text-white">meta</span>
                            <span className="text-primary">Thesi</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    {session ? <MainNav /> : null}

                    <div className="flex items-center gap-2 sm:gap-4">
                        <ModeToggle />
                        {session ? (
                            <>
                                <NotificationBellClient />
                                <div className="h-8 w-px bg-border dark:bg-border hidden sm:block"></div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex items-center gap-3 pl-2 cursor-pointer group outline-none">
                                            <div className="hidden sm:flex flex-col items-end">
                                                <span className="text-sm font-semibold text-foreground dark:text-white group-hover:text-primary transition-colors">
                                                    {session.user?.name || "User"}
                                                </span>
                                                <span className="text-xs text-text-tertiary font-medium bg-muted dark:bg-muted px-2 py-0.5 rounded-full mt-0.5">
                                                    {session.user?.email}
                                                </span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-muted dark:bg-muted overflow-hidden border-2 border-transparent group-hover:border-primary transition-all flex items-center justify-center">
                                                <Avatar>
                                                    <AvatarImage src={session.user?.image || undefined} />
                                                    <AvatarFallback>{session.user?.name?.substring(0, 2).toUpperCase() || "US"}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-64 p-2 bg-card rounded-2xl border border-border shadow-floating">

                                        {/* My Account (Non-clickable) */}
                                        <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-muted hover:text-primary transition-colors cursor-default">
                                            <UserIcon className="w-5 h-5" />
                                            My Account
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
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost" className="cursor-pointer">Σύνδεση</Button>
                                </Link>
                                <Link href="/signup" className="hidden sm:block">
                                    <Button className="bg-primary hover:bg-primary-hover text-white rounded-2xl cursor-pointer">Εγγραφή</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button - simplified for now */}
                        {/* Mobile Menu */}
                        <MobileMenu session={session} />
                    </div>
                </div>
            </div>
        </FloatingNavWrapper>
    )
}
