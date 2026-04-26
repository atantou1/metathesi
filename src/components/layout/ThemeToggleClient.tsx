"use client"

import { useTheme } from "next-themes"
import { Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggleClient() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="flex items-center justify-between px-4 py-2.5 select-none hover:bg-muted transition-colors rounded-sm opacity-50">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Moon className="w-5 h-5" />
                    Εναλλαγή Dark mode
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle transition duration-200 ease-in">
                    <div className="block overflow-hidden h-5 rounded-full bg-border-strong cursor-wait"></div>
                </div>
            </div>
        )
    }

    const isDark = resolvedTheme === "dark"

    return (
        <div className="flex items-center justify-between px-4 py-2.5 select-none hover:bg-muted transition-colors rounded-sm group/toggle">
            <div className="flex items-center gap-3 text-sm text-text-secondary group-hover/toggle:text-primary transition-colors">
                <Moon className="w-5 h-5" />
                Εναλλαγή Dark mode
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle transition duration-200 ease-in">
                <input
                    type="checkbox"
                    name="toggle"
                    id="theme-toggle"
                    checked={isDark}
                    onChange={() => setTheme(isDark ? "light" : "dark")}
                    className="peer absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-border-strong right-5 checked:right-0 duration-200 ease-in checked:border-primary z-10"
                />
                <label
                    htmlFor="theme-toggle"
                    className="block overflow-hidden h-5 rounded-full bg-border-strong cursor-pointer peer-checked:bg-primary transition-colors"
                ></label>
            </div>
        </div>
    )
}
