
import Link from "next/link"
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { MapPin, Bell, Menu, User as UserIcon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export async function Navbar() {
    const session = await auth()

    return (
        <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">metaThesi</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        {session ? (
                            <>
                                <Link href="/dashboard" className="text-slate-900 dark:text-slate-100 font-medium px-1 py-2 border-b-2 border-blue-600">
                                    Dashboard
                                </Link>
                                <Link href="/request/create" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium px-1 py-2 border-b-2 border-transparent hover:border-slate-300 transition-colors">
                                    My Request
                                </Link>
                                {/* Future page for Matches */}
                                <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium px-1 py-2 border-b-2 border-transparent hover:border-slate-300 transition-colors">
                                    Matches
                                </Link>
                            </>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-4">
                        {session ? (
                            <>
                                <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                    <Bell className="w-6 h-6" />
                                    <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                                </button>
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
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile">Profile Settings</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/request/create">Manage Request</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <form
                                                action={async () => {
                                                    "use server"
                                                    await signOut()
                                                }}
                                                className="w-full"
                                            >
                                                <button type="submit" className="w-full text-left">
                                                    Sign Out
                                                </button>
                                            </form>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost">Log In</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button - simplified for now */}
                        <button className="md:hidden p-2 text-slate-400">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
