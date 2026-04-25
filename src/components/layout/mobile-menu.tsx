"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, LogOut, User as UserIcon, Settings, FileText, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
// import { User } from "next-auth" // Importing User type if needed, but session.user is usually enough context

interface MobileMenuProps {
    session: any // Using any for now to avoid extensive type imports, but could be specific Session type
}

export function MobileMenu({ session }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
    }, [])

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    const links = [
        {
            href: "/dashboard",
            label: "Επισκόπηση",
            active: pathname === "/dashboard",
            icon: FileText
        },
        {
            href: "/matches",
            label: "Ταιριάσματα",
            active: pathname === "/matches",
            icon: FileText
        },
        {
            href: "/stats",
            label: "Στατιστικά",
            active: pathname === "/stats",
            icon: FileText
        }
    ]

    const menuContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 backdrop-blur-sm"
                    />

                    {/* Menu Panel - updated to glassmorphism */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-[280px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-l border-white/40 dark:border-slate-800/50 z-50 shadow-2xl overflow-y-auto"
                    >
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center">
                                <span className="font-semibold text-lg text-slate-900 dark:text-white">Menu</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 py-4 px-2 space-y-1">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                            link.active
                                                ? "bg-blue-50/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                                        )}
                                    >
                                        {/* We could add icons to the links array if implemented */}
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30">
                                {session ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 px-2">
                                            <Avatar className="h-10 w-10 border-2 border-white/50 dark:border-slate-700 shadow-sm bg-white/50 dark:bg-slate-800">
                                                <AvatarImage src={session.user?.image || undefined} />
                                                <AvatarFallback>{session.user?.name?.substring(0, 2).toUpperCase() || "US"}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {session.user?.name || "User"}
                                                </span>
                                                <span className="text-xs text-slate-500 truncate max-w-[150px]">
                                                    {session.user?.email}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-1 pt-2">
                                            <Link
                                                href="/settings"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100/50 dark:text-slate-300 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Ρυθμίσεις
                                            </Link>
                                            <button
                                                onClick={() => signOut()}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Αποσύνδεση
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-2">
                                        <Link href="/login" onClick={() => setIsOpen(false)}>
                                            <Button variant="outline" className="w-full justify-center cursor-pointer bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50">Σύνδεση</Button>
                                        </Link>
                                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full justify-center bg-[#0369a1] hover:bg-[#0c4a6e] text-white rounded-lg cursor-pointer">Εγγραφή</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {mounted && createPortal(menuContent, document.body)}
        </div>
    )
}

