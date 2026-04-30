"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, LogOut, User as UserIcon, Settings, BarChart3, FileText, Moon, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useNav } from "./floating-nav-wrapper"

interface MobileMenuProps {
    session: any 
}

export function MobileMenu({ session }: MobileMenuProps) {
    const { isOpen, setIsOpen } = useNav()
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
    }, [])

    const links = [
        {
            href: "/dashboard",
            label: "Επισκόπηση",
            subtext: "Κεντρικός πίνακας ελέγχου",
            active: pathname === "/dashboard",
            icon: FileText
        },
        {
            href: "/matches",
            label: "Ταιριάσματα",
            subtext: "Προτάσεις και αιτήσεις",
            active: pathname === "/matches",
            icon: UserIcon
        },
        {
            href: "/stats",
            label: "Στατιστικά",
            subtext: "Δεδομένα μεταθέσεων",
            active: pathname === "/stats",
            icon: BarChart3
        }
    ]

    const menuContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-[calc(100vh-64px)] flex flex-col p-6 space-y-6 md:hidden"
                >
                    {/* Top Section: Navigation Links - Ultra Minimal */}
                    <div className="flex flex-col space-y-1">
                        {links.map((link, index) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 p-3 rounded-2xl transition-all",
                                        link.active
                                            ? "text-primary font-bold bg-primary/5"
                                            : "text-foreground/70 dark:text-white/70 hover:bg-muted/50"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                        link.active ? "text-primary" : "text-text-tertiary"
                                    )}>
                                        <link.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-base tracking-tight">{link.label}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border/40 mx-4" />

                    {/* Utilities Section - Ultra Minimal */}
                    <div className="px-1">
                        <div className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 flex items-center justify-center text-text-tertiary">
                                    <Moon className="w-5 h-5" />
                                </div>
                                <span className="text-base font-medium text-foreground/70 dark:text-white/70">Σκοτεινή Λειτουργία</span>
                            </div>
                            <button
                                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                                className={cn(
                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer",
                                    resolvedTheme === "dark" ? "bg-primary" : "bg-muted-foreground/30"
                                )}
                            >
                                <motion.span
                                    animate={{ x: resolvedTheme === "dark" ? 22 : 4 }}
                                    className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm"
                                />
                            </button>
                        </div>
                    </div>

                    {/* Spacer to push content to bottom */}
                    <div className="flex-1" />

                    {/* Bottom Section: Account / Actions */}
                    <div className="pb-4 space-y-4">
                        {session ? (
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center gap-4 px-2">
                                    <Avatar className="h-12 w-12 border border-border/50 shadow-sm">
                                        <AvatarImage src={session.user?.image || undefined} />
                                        <AvatarFallback className="font-bold">{session.user?.name?.substring(0, 2).toUpperCase() || "US"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-foreground">
                                            {session.user?.name}
                                        </span>
                                        <span className="text-xs text-text-tertiary">
                                            {session.user?.email}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/settings"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-muted/40 text-sm font-bold hover:bg-primary-soft hover:text-primary transition-all border border-border/50"
                                    >
                                        <Settings className="w-5 h-5" />
                                        Ρυθμίσεις
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-600 text-sm font-bold hover:bg-red-600 hover:text-white transition-all border border-red-500/10 cursor-pointer"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Έξοδος
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-3">
                                <Link href="/signup" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full h-14 rounded-2xl text-base font-black bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25 cursor-pointer border-none">
                                        ΔΗΜΙΟΥΡΓΙΑ ΛΟΓΑΡΙΑΣΜΟΥ
                                    </Button>
                                </Link>
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="ghost" className="w-full h-12 rounded-2xl text-sm font-bold text-foreground hover:bg-muted/50 cursor-pointer border border-border/50">
                                        Σύνδεση
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-text-quaternary hover:text-text-secondary dark:hover:text-foreground transition-all duration-300 cursor-pointer relative z-[110]"
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                <div className="relative w-6 h-6 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="w-6 h-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu className="w-6 h-6" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </button>

            {mounted && isOpen && (
                <div className="absolute left-0 top-14 w-full pointer-events-auto">
                    {menuContent}
                </div>
            )}
        </div>
    )
}
