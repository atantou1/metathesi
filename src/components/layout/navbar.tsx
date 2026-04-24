
import Link from "next/link"
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { User as UserIcon, Settings, FileText, Moon, LogOut } from "lucide-react"
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

export async function Navbar() {
    const session = await auth()

    return (
        <FloatingNavWrapper>
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                        <Logo className="w-8 h-8 text-[#0369A1]" />
                        <span className="text-xl font-bold tracking-tight">
                            <span className="text-[#0F172A] dark:text-white">meta</span>
                            <span className="text-[#0369A1]">Thesi</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    {session ? <MainNav /> : null}

                    <div className="flex items-center gap-4">
                        {session ? (
                            <>
                                <NotificationBellClient />
                                <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 hidden sm:block"></div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex items-center gap-3 pl-2 cursor-pointer group outline-none">
                                            <div className="hidden sm:flex flex-col items-end">
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                                    {session.user?.name || "User"}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full mt-0.5">
                                                    {session.user?.email}
                                                </span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border-2 border-transparent group-hover:border-blue-600 transition-all flex items-center justify-center">
                                                <Avatar>
                                                    <AvatarImage src={session.user?.image || undefined} />
                                                    <AvatarFallback>{session.user?.name?.substring(0, 2).toUpperCase() || "US"}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-64 p-2 bg-white rounded-xl border border-slate-200 shadow-xl">

                                        {/* My Account (Non-clickable) */}
                                        <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors cursor-default">
                                            <UserIcon className="w-5 h-5" />
                                            My Account
                                        </div>

                                        <div className="h-px bg-slate-100 my-1"></div>

                                        {/* Settings (Clickable) */}
                                        <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                                            <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors cursor-pointer w-full">
                                                <Settings className="w-5 h-5" />
                                                Ρυθμίσεις
                                            </Link>
                                        </DropdownMenuItem>

                                        <div className="h-px bg-slate-100 my-1"></div>

                                        {/* Light/Dark Toggle (Visual Only) */}
                                        <div className="flex items-center justify-between px-4 py-2.5 select-none hover:bg-slate-50 transition-colors rounded-sm">
                                            <div className="flex items-center gap-3 text-sm text-slate-700">
                                                <Moon className="w-5 h-5" />
                                                Εναλλαγή Dark mode
                                            </div>
                                            <div className="relative inline-block w-10 mr-2 align-middle transition duration-200 ease-in">
                                                <input
                                                    type="checkbox"
                                                    name="toggle"
                                                    id="toggle"
                                                    className="peer absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 right-5 checked:right-0 duration-200 ease-in checked:border-blue-700"
                                                />
                                                <label
                                                    htmlFor="toggle"
                                                    className="block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer peer-checked:bg-blue-700 transition-colors"
                                                ></label>
                                            </div>
                                        </div>

                                        <div className="h-px bg-slate-100 my-1"></div>

                                        {/* Logout */}
                                        <UserNavLogout />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost">Σύνδεση</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-[#0369a1] hover:bg-[#0c4a6e] text-white rounded-lg">Εγγραφή</Button>
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
