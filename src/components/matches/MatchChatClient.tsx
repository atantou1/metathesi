"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { MatchResult } from "@/lib/matching"
import { getMatchMessages, sendMessage } from "@/actions/chat"
import { format } from "date-fns"
import { el } from "date-fns/locale"

type MessageType = {
    id: number;
    content: string;
    createdAt: Date;
    senderProfileId: number;
    senderProfile: {
        user: {
            id: number;
            fullName: string;
        }
    }
}

function MatchCardItem({
    match,
    currentUserId,
    isExpanded,
    onToggle
}: {
    match: MatchResult,
    currentUserId: number,
    isExpanded: boolean,
    onToggle: () => void
}) {
    const isOnline = match.status === 'active'
    const [messages, setMessages] = useState<MessageType[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isExpanded) return

        let isMounted = true
        const fetchMessages = async () => {
            try {
                const fetchedMessages = await getMatchMessages(match.id)
                if (isMounted) {
                    setMessages(fetchedMessages)
                }
            } catch (error) {
                console.error("Error fetching messages:", error)
            }
        }

        fetchMessages()
        const interval = setInterval(fetchMessages, 5000)
        return () => {
            isMounted = false
            clearInterval(interval)
        }
    }, [isExpanded, match.id])

    useEffect(() => {
        if (isExpanded) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isExpanded])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !isOnline || isSending) return

        const content = newMessage.trim()
        setNewMessage("")
        setIsSending(true)

        const tempId = Date.now()
        const tempMsg: MessageType = {
            id: tempId,
            content,
            createdAt: new Date(),
            senderProfileId: -1,
            senderProfile: {
                user: { id: currentUserId, fullName: "You" }
            }
        }
        setMessages(prev => [...prev, tempMsg])

        try {
            const actualMessage = await sendMessage(match.id, content)
            setMessages(prev => prev.map(m => m.id === tempId ? actualMessage : m))
        } catch (error) {
            console.error("Error sending message:", error)
            setMessages(prev => prev.filter(m => m.id !== tempId))
        } finally {
            setIsSending(false)
        }
    }

    const getInitials = (name: string) => {
        return name ? (name.charAt(0).toUpperCase() + (name.split(' ')?.[1]?.charAt(0)?.toUpperCase() ?? '')) : "?"
    }

    // Following HTML variations for different card backgrounds and colors
    const colors = [
        { bg: 'bg-gradient-to-br from-blue-50 to-indigo-50', text: 'text-indigo-300', fill: 'bg-indigo-100', accent: 'bg-indigo-100 text-indigo-600' },
        { bg: 'bg-indigo-50', text: 'text-indigo-300', fill: 'bg-indigo-100', accent: 'bg-accent-vibrant/10 text-accent-vibrant' },
        { bg: 'bg-purple-50', text: 'text-purple-300', fill: 'bg-purple-100', accent: 'bg-teal-100 text-teal-600' },
        { bg: 'bg-blue-50', text: 'text-blue-300', fill: 'bg-blue-100', accent: 'bg-indigo-100 text-indigo-600' },
        { bg: 'bg-gradient-to-br from-gray-50 to-slate-50', text: 'text-slate-300', fill: 'bg-slate-100', accent: 'bg-slate-100 text-slate-600' },
        { bg: 'bg-amber-50', text: 'text-amber-300', fill: 'bg-amber-100', accent: 'bg-amber-100 text-amber-600' },
        { bg: 'bg-rose-50', text: 'text-rose-300', fill: 'bg-rose-100', accent: 'bg-rose-100 text-rose-600' }
    ]
    const activeColorIndex = match.id % 4; // Use first 4 colors for active matches
    const historyColorIndex = 4 + (match.id % 3); // Use last 3 colors for history
    const theme = isOnline ? colors[activeColorIndex] : colors[historyColorIndex];

    const cardContainerClass = isOnline
        ? "group relative card-container bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-soft transition-all duration-300 h-auto"
        : "group relative card-container bg-white/80 backdrop-blur-md rounded-[2rem] shadow-soft border border-white hover:border-slate-300/20 transition-all duration-300 h-auto";

    return (
        <div
            className={cardContainerClass}
            style={{
                height: isExpanded ? '600px' : 'auto',
                gridRow: isExpanded ? 'span 3' : 'auto',
                transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease'
            }}
        >
            {/* SUMMARY VIEW */}
            <div className={`card-summary flex-col p-6 h-fit relative w-full ${!isOnline ? 'opacity-90' : ''} ${isExpanded ? 'hidden' : 'flex'}`}>
                <div className="absolute top-6 right-6">
                    {isOnline ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-600 uppercase tracking-wide">
                            Online
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-400 uppercase tracking-wide">
                            Offline
                        </span>
                    )}
                </div>

                <div className="flex flex-col items-center mb-6">
                    <div className={`w-20 h-20 rounded-full ${theme.bg} border-4 border-white shadow-md flex items-center justify-center ${theme.text} overflow-hidden mb-4 ${!isOnline ? (match.id % 2 === 0 ? 'grayscale' : 'grayscale-[0.5]') : ''}`}>
                        <span className="font-bold text-3xl">{getInitials(match.user.fullName)}</span>
                    </div>
                    <h3 className={`font-bold text-xl ${isOnline ? 'text-slate-800' : 'text-slate-600'}`}>{match.user.fullName}</h3>
                    <p className={`text-sm font-medium mt-1 ${isOnline ? 'text-slate-500' : 'text-slate-400'}`}>{match.user.currentZone.name}</p>
                </div>

                {isOnline ? (
                    <div className="flex items-center justify-center gap-2 mb-6 w-full">
                        <span className="inline-flex items-center justify-center h-8 px-3 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 whitespace-nowrap">
                            {format(new Date(match.matchDate), "d MMM yyyy", { locale: el })}
                        </span>
                        <span className={`inline-flex items-center justify-center h-8 px-3 rounded-full text-xs font-bold whitespace-nowrap ${theme.accent}`}>
                            Είστε η {match.rank}η επιλογή
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 mb-6 w-full">
                        <div className="flex items-center justify-between text-xs px-1">
                            <span className="text-slate-400 font-medium">Δημιουργία</span>
                            <span className="font-semibold text-slate-600">{format(new Date(match.matchDate), "d MMM yyyy", { locale: el })}</span>
                        </div>
                        {match.completedAt && (
                            <div className="flex items-center justify-between text-xs px-1">
                                <span className="text-slate-400 font-medium">Ολοκλήρωση</span>
                                <span className="font-semibold text-slate-600">{format(new Date(match.completedAt), "d MMM yyyy", { locale: el })}</span>
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={onToggle}
                    type="button"
                    className={`w-full h-[48px] px-4 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 select-none 
                        ${isOnline
                            ? 'bg-primary text-white hover:bg-blue-600 shadow-lg shadow-primary/20 cursor-pointer'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer'}`}
                >
                    <span className="material-symbols-outlined text-[20px]">{isOnline ? 'chat_bubble' : 'history'}</span>
                    {isOnline ? 'Συνομιλία' : 'Προβολή Ιστορικού'}
                </button>
            </div>

            {/* CHAT VIEW (Expanded) */}
            <div className={`card-chat h-full absolute inset-0 bg-white rounded-[2rem] z-10 flex-col ${isExpanded ? 'flex' : 'hidden'}`}>
                <div className="p-6 pb-4 flex items-start justify-between bg-white border-b border-slate-100 rounded-t-[2rem]">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className={`w-12 h-12 rounded-2xl ${theme.bg} border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden text-lg font-bold ${theme.text} ${!isOnline ? (match.id % 2 === 0 ? 'grayscale' : 'grayscale-[0.5]') : ''}`}>
                                {getInitials(match.user.fullName)}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-[2px] border-white rounded-full shadow-sm ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`} title={isOnline ? "Online" : "Offline"}></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">{match.user.fullName}</h3>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">{match.user.currentZone.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onToggle}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors cursor-pointer select-none focus:outline-none"
                        title="Close Chat"
                    >
                        <span className="material-icons">more_horiz</span>
                    </button>
                </div>

                <div className="flex-1 flex flex-col bg-slate-50/50 relative overflow-hidden">
                    <div className="absolute inset-0 overflow-y-auto p-6 space-y-5 scrollbar-hide">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-slate-400 gap-2 h-full opacity-50">
                                <span className="material-symbols-outlined text-4xl">{isOnline ? 'chat' : 'history'}</span>
                                <p className="text-sm">Δεν υπάρχουν μηνύματα ακόμη.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-center mb-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/80 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                                        {format(new Date(match.matchDate), "d MMMM yyyy", { locale: el })}
                                    </span>
                                </div>

                                {messages.map((msg) => {
                                    const isMine = msg.senderProfile?.user?.id === currentUserId
                                    return isMine ? (
                                        <div key={msg.id} className={`flex items-end gap-3 max-w-[90%] ml-auto flex-row-reverse group/msg ${!isOnline ? 'opacity-70' : ''}`}>
                                            <div className="flex flex-col gap-1 items-end">
                                                <div className={`p-3.5 rounded-2xl rounded-br-none text-[14px] leading-relaxed shadow-sm ${isOnline
                                                    ? 'bg-gradient-to-br from-primary to-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                    : 'bg-slate-200 text-slate-600'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                                <div className={`flex items-center gap-1 mr-1 ${isOnline ? 'opacity-0 group-hover/msg:opacity-100 transition-opacity' : ''}`}>
                                                    <span className="text-[10px] text-slate-400">{format(new Date(msg.createdAt), "HH:mm")}</span>
                                                    {isOnline && <span className="material-icons text-[12px] text-primary">done_all</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={msg.id} className={`flex items-end gap-3 max-w-[90%] group/msg ${!isOnline ? 'opacity-70' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white shadow-sm font-bold flex items-center justify-center text-sm ${!isOnline ? (match.id % 2 === 0 ? 'grayscale' : 'grayscale-[0.5]') : ''} ${!isOnline ? 'bg-slate-100 text-slate-400' : theme.text + ' bg-white'}`}>
                                                {getInitials(match.user.fullName)}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="bg-white p-3.5 rounded-2xl rounded-bl-none shadow-bubble text-slate-600 text-[14px] leading-relaxed">
                                                    {msg.content}
                                                </div>
                                                <span className={`text-[10px] text-slate-400 ml-1 ${isOnline ? 'opacity-0 group-hover/msg:opacity-100 transition-opacity' : ''}`}>
                                                    {format(new Date(msg.createdAt), "HH:mm")}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>
                </div>

                {isOnline ? (
                    <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3 rounded-b-[2rem]">
                        <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-50 rounded-full transition-colors">
                            <span className="material-symbols-outlined">add_circle</span>
                        </button>
                        <div className="flex-1 relative">
                            <input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="w-full bg-slate-50 border-none rounded-full py-3 px-5 text-sm placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-inner focus:outline-none"
                                placeholder="Γράψτε ένα μήνυμα..."
                                type="text"
                                disabled={isSending}
                            />
                            <button className="absolute right-2 top-1.5 p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors">
                                <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
                            </button>
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || isSending}
                            className="w-11 h-11 bg-gradient-to-tr from-primary to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined filled">send</span>
                        </button>
                    </div>
                ) : (
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-3 rounded-b-[2rem]">
                        <div className="w-full bg-slate-200/50 rounded-xl py-4 px-5 text-sm text-slate-500 font-medium text-center flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">lock</span>
                            Η συνομιλία έχει αρχειοθετηθεί
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export function MatchChatClient({
    activeMatches,
    historyMatches,
    currentUserId
}: {
    activeMatches: MatchResult[],
    historyMatches: MatchResult[],
    currentUserId: number
}) {
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
    const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null)
    const searchParams = useSearchParams()

    useEffect(() => {
        const openChatMatchId = searchParams.get('openChat')
        if (openChatMatchId) {
            const id = parseInt(openChatMatchId)

            // Check if it's in history to auto-switch tab
            if (historyMatches.some(m => m.id === id)) {
                setActiveTab('history')
            } else if (activeMatches.some(m => m.id === id)) {
                setActiveTab('active')
            }

            setExpandedMatchId(id)
        }
    }, [searchParams, activeMatches, historyMatches])

    const matchesList = activeTab === 'active' ? activeMatches : historyMatches

    const handleToggleCollapse = (matchId: number) => {
        setExpandedMatchId(prev => prev === matchId ? null : matchId)
    }

    return (
        <div className="font-display text-neutral-text-main antialiased min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">

                {/* Tabs */}
                <div className="relative flex justify-center mb-8 mx-auto p-1 bg-slate-200/50 backdrop-blur-sm rounded-full w-fit">
                    <div
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-transform duration-300 ease-out z-0 
                            ${activeTab === 'active' ? 'left-1 translate-x-0' : 'left-1 translate-x-[100%]'}`}
                    ></div>

                    <button
                        className={`relative z-10 px-8 py-2.5 rounded-full font-bold text-sm select-none w-32 text-center transition-colors focus:outline-none cursor-pointer
                            ${activeTab === 'active' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => { setActiveTab('active'); setExpandedMatchId(null); }}
                    >
                        Ενεργές
                    </button>
                    <button
                        className={`relative z-10 px-8 py-2.5 rounded-full font-bold text-sm select-none w-32 text-center transition-colors focus:outline-none cursor-pointer
                            ${activeTab === 'history' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => { setActiveTab('history'); setExpandedMatchId(null); }}
                    >
                        Ιστορικό
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matchesList.length > 0 ? (
                        matchesList.map((match) => (
                            <MatchCardItem
                                key={match.id}
                                match={match}
                                currentUserId={currentUserId}
                                isExpanded={expandedMatchId === match.id}
                                onToggle={() => handleToggleCollapse(match.id)}
                            />
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 mx-auto">
                                <span className="material-symbols-outlined text-4xl">search_off</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Καμία {activeTab === 'active' ? 'ενεργή' : 'παλαιότερη'} σύνδεση</h2>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                Δεν βρέθηκαν αντιστοιχίσεις σε αυτήν την καρτέλα. Ο αλγόριθμος λειτουργεί 24/7 και θα σας ειδοποιήσει αν υπάρξει νέο ταίριασμα.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
