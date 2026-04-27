"use client"

import React, { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { format } from "date-fns"
import { el } from "date-fns/locale"
import { Satellite } from "lucide-react"
import { useMatches } from "./MatchesContext"

export function MatchesSidebar() {
    const { activeMatches, historyMatches } = useMatches()
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
    const pathname = usePathname()
    const router = useRouter()

    const matchesList = activeTab === 'active' ? activeMatches : historyMatches

    const getInitials = (name: string) => {
        return name ? (name.charAt(0).toUpperCase() + (name.split(' ')?.[1]?.charAt(0)?.toUpperCase() ?? '')) : "?"
    }

    return (
        <>
            <div className="h-20 px-4 border-b border-border/50 bg-muted/50 flex items-center">
                <div className="relative flex justify-center mx-auto p-1 bg-muted/50 backdrop-blur-sm rounded-full w-full max-w-sm">
                    <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-card rounded-full shadow-sm z-0 transition-transform duration-300 ease-out ${activeTab === 'active' ? 'left-1 translate-x-0' : 'left-1 translate-x-[100%]'}`}></div>
                    <button 
                        onClick={() => setActiveTab('active')}
                        className={`relative z-10 py-2 rounded-full font-bold text-[13px] select-none w-1/2 text-center transition-colors ${activeTab === 'active' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Ενεργές ({activeMatches.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`relative z-10 py-2 rounded-full font-bold text-[13px] select-none w-1/2 text-center transition-colors ${activeTab === 'history' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Ιστορικό ({historyMatches.length})
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-surface-dim/30">
                {matchesList.length > 0 ? (
                    matchesList.map((match) => {
                        const isOnline = match.status === 'active'
                        const isActiveRoute = pathname === `/matches/${match.id}`
                        
                        return (
                            <div 
                                key={match.id}
                                onClick={() => router.push(`/matches/${match.id}`, { scroll: false })}
                                className={`group p-3 rounded-2xl cursor-pointer transition-all border ${
                                    isActiveRoute ? 'bg-primary-soft border-primary/20' : 
                                    isOnline ? 'bg-card border-border hover:border-primary/30' : 
                                    'bg-card border-border hover:border-primary/30 opacity-80 hover:opacity-100'
                                }`}
                            >
                                <div className={`flex gap-3 ${isOnline ? 'items-center' : 'items-start'}`}>
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold ${
                                            isOnline ? 'bg-warning-soft border border-warning/20 text-warning' :
                                            'bg-muted border border-border text-muted-foreground grayscale'
                                        }`}>
                                            {getInitials(match.user.fullName)}
                                        </div>
                                        {isOnline && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-background rounded-full bg-success"></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h4 className={`text-sm font-bold truncate ${isActiveRoute ? 'text-primary' : isOnline ? 'text-foreground' : 'text-foreground/70 group-hover:text-foreground'}`}>{match.user.fullName}</h4>
                                            <span className={`text-[10px] font-bold ${isOnline ? 'text-primary' : 'text-muted-foreground'}`}>
                                                {format(new Date(match.matchDate), "d MMM yyyy", { locale: el })}
                                            </span>
                                        </div>
                                        
                                        <span className="text-[10px] font-medium text-muted-foreground block mb-1.5 truncate">
                                            {match.user.currentZone.name}
                                        </span>
                                        
                                        {isOnline ? (
                                            <div className="flex gap-2">
                                                <span className="text-[10px] font-bold bg-card text-primary px-2 py-0.5 rounded-2xl border border-primary/20 shadow-soft">
                                                    {match.rank}η Επιλογή
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="bg-muted rounded-2xl p-2 border border-border space-y-1 mt-1">
                                                {match.matchDate && (
                                                    <div className="flex items-center justify-between text-[10px]">
                                                        <span className="text-muted-foreground font-medium">Έναρξη:</span>
                                                        <span className="font-bold text-foreground">{format(new Date(match.matchDate), "d MMM yyyy", { locale: el })}</span>
                                                    </div>
                                                )}
                                                {match.completedAt && (
                                                    <div className="flex items-center justify-between text-[10px]">
                                                        <span className="text-muted-foreground font-medium">Λήξη:</span>
                                                        <span className="font-bold text-foreground">{format(new Date(match.completedAt), "d MMM yyyy", { locale: el })}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center opacity-80 mt-10">
                        <div className="w-16 h-16 bg-card border border-border shadow-soft rounded-full flex items-center justify-center text-primary mb-4">
                            <Satellite className="w-8 h-8" />
                        </div>
                        <h3 className="text-sm font-bold text-foreground mb-2">Καμία {activeTab === 'active' ? 'ενεργή σύνδεση' : 'ιστορική καταγραφή'}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-[250px]">
                            Δεν βρέθηκαν αντιστοιχίσεις σε αυτήν την καρτέλα. Ο αλγόριθμος λειτουργεί 24/7 και θα σας ειδοποιήσει αν υπάρξει νέο ταίριασμα.
                        </p>
                    </div>
                )}
            </div>
        </>
    )
}
