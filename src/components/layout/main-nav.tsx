"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
    const pathname = usePathname()

    const links = [
        {
            href: "/dashboard",
            label: "Επισκόπηση",
            active: pathname === "/dashboard"
        },
        {
            href: "/matches",
            label: "Αμοιβαίες",
            active: pathname === "/matches"
        },
        {
            href: "/stats",
            label: "Στατιστικά",
            active: pathname === "/stats"
        }
    ]

    return (
        <div className="hidden md:flex items-center space-x-2">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "px-5 py-2.5 text-sm font-medium rounded-2xl transition-colors",
                        link.active
                            ? "text-sky-700 bg-sky-50/80 dark:text-sky-400 dark:bg-sky-900/40"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
                    )}
                >
                    {link.label}
                </Link>
            ))}
        </div>
    )
}
