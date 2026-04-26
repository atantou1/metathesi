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
                            ? "text-primary bg-primary-soft dark:text-primary dark:bg-primary-soft"
                            : "text-text-tertiary hover:text-foreground hover:bg-muted dark:text-text-quaternary dark:hover:text-foreground dark:hover:bg-muted"
                    )}
                >
                    {link.label}
                </Link>
            ))}
        </div>
    )
}
