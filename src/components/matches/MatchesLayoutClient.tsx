"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { MatchesSidebar } from "./MatchesSidebar"
import { MatchesContext } from "./MatchesContext"
import { MatchResult } from "@/lib/matching"

export function MatchesLayoutClient({
    activeMatches,
    historyMatches,
    currentUserId,
    children
}: {
    activeMatches: MatchResult[]
    historyMatches: MatchResult[]
    currentUserId: number
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isListOnly = pathname === "/matches"

    return (
        <MatchesContext.Provider value={{ activeMatches, historyMatches, currentUserId }}>
            <div className="flex-grow flex w-full mx-auto overflow-hidden relative h-[calc(100vh-80px)] mt-20 max-w-[1600px]">
                {/* Sidebar */}
                <div className={`${isListOnly ? 'w-full flex md:w-[380px] lg:w-[420px]' : 'hidden md:flex md:w-[380px] lg:w-[420px]'} bg-white border-r border-slate-200 flex-col flex-shrink-0 z-10 h-full`}>
                    <MatchesSidebar />
                </div>
                
                {/* Right Area */}
                <div className={`${isListOnly ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-slate-50/50 relative h-full`}>
                    {children}
                </div>
            </div>
        </MatchesContext.Provider>
    )
}
