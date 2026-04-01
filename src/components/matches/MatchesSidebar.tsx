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
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="relative flex justify-center mx-auto p-1 bg-slate-200/50 backdrop-blur-sm rounded-full w-full max-w-sm">
                    <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm z-0 transition-transform duration-300 ease-out ${activeTab === 'active' ? 'left-1 translate-x-0' : 'left-1 translate-x-[100%]'}`}></div>
                    <button 
                        onClick={() => setActiveTab('active')}
                        className={`relative z-10 py-2 rounded-full font-bold text-[13px] select-none w-1/2 text-center transition-colors ${activeTab === 'active' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Ενεργές ({activeMatches.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`relative z-10 py-2 rounded-full font-bold text-[13px] select-none w-1/2 text-center transition-colors ${activeTab === 'history' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Ιστορικό ({historyMatches.length})
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/30">
                {matchesList.length > 0 ? (
                    matchesList.map((match) => {
                        const isOnline = match.status === 'active'
                        const isActiveRoute = pathname === `/matches/${match.id}`
                        
                        return (
                            <div 
                                key={match.id}
                                onClick={() => router.push(`/matches/${match.id}`, { scroll: false })}
                                className={`group p-3 rounded-xl cursor-pointer transition-all border ${
                                    isActiveRoute ? 'bg-sky-50 border-sky-100' : 
                                    isOnline ? 'bg-white border-slate-200 hover:border-slate-300' : 
                                    'bg-white border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                                }`}
                            >
                                <div className={`flex gap-3 ${isOnline ? 'items-center' : 'items-start'}`}>
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${
                                            isOnline ? 'bg-amber-50 border border-amber-100 text-amber-500' :
                                            'bg-slate-100 border border-slate-200 text-slate-500 grayscale'
                                        }`}>
                                            {getInitials(match.user.fullName)}
                                        </div>
                                        {isOnline && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full bg-emerald-500"></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h4 className={`text-sm font-bold truncate ${isActiveRoute ? 'text-[#0369a1]' : isOnline ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>{match.user.fullName}</h4>
                                            <span className={`text-[10px] font-bold ${isOnline ? 'text-[#0369a1]' : 'text-slate-400'}`}>
                                                {format(new Date(match.matchDate), "d MMM yyyy", { locale: el })}
                                            </span>
                                        </div>
                                        
                                        <span className="text-[10px] font-medium text-slate-500 block mb-1.5 truncate">
                                            {match.user.currentZone.name}
                                        </span>
                                        
                                        {isOnline ? (
                                            <div className="flex gap-2">
                                                <span className="text-[10px] font-bold bg-white text-[#0369a1] px-2 py-0.5 rounded-md border border-sky-100 shadow-sm">
                                                    {match.rank}η Επιλογή
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 space-y-1 mt-1">
                                                {match.matchDate && (
                                                    <div className="flex items-center justify-between text-[10px]">
                                                        <span className="text-slate-400 font-medium">Έναρξη:</span>
                                                        <span className="font-bold text-slate-600">{format(new Date(match.matchDate), "d MMM yyyy", { locale: el })}</span>
                                                    </div>
                                                )}
                                                {match.completedAt && (
                                                    <div className="flex items-center justify-between text-[10px]">
                                                        <span className="text-slate-400 font-medium">Λήξη:</span>
                                                        <span className="font-bold text-slate-600">{format(new Date(match.completedAt), "d MMM yyyy", { locale: el })}</span>
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
                        <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center text-[#0369a1] mb-4">
                            <Satellite className="w-8 h-8" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-700 mb-2">Καμία {activeTab === 'active' ? 'ενεργή σύνδεση' : 'ιστορική καταγραφή'}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-[250px]">
                            Δεν βρέθηκαν αντιστοιχίσεις σε αυτήν την καρτέλα. Ο αλγόριθμος λειτουργεί 24/7 και θα σας ειδοποιήσει αν υπάρξει νέο ταίριασμα.
                        </p>
                    </div>
                )}
            </div>
        </>
    )
}
