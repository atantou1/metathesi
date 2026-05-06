
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

import { NavbarUserControl } from "./NavbarUserControl"

export async function Navbar() {
    const session = await auth()

    return (
        <FloatingNavWrapper>
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                        <Logo className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold tracking-tight">
                            <span className="text-foreground dark:text-white">meta</span>
                            <span className="text-primary">Thesi</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    {session ? <MainNav /> : null}

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:block">
                            <ModeToggle />
                        </div>
                        {session ? (
                            <>
                                <NotificationBellClient />
                                <div className="h-8 w-px bg-border dark:bg-border hidden sm:block"></div>

                                <NavbarUserControl session={session} />
                            </>
                        ) : (

                            <div className="flex items-center gap-3">
                                <Link href="/login" className="hidden sm:block">
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
