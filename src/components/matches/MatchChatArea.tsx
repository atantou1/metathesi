"use client"

import React, { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { el } from "date-fns/locale"
import { ArrowLeft, MapPin, Sparkles, CheckCheck, Paperclip, Send, MoreVertical, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { getMatchMessages, sendMessage } from "@/actions/chat"
import { useMatches } from "./MatchesContext"

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

export function MatchChatArea({ matchId }: { matchId: number }) {
    const { activeMatches, historyMatches, currentUserId } = useMatches()
    const router = useRouter()
    
    const match = activeMatches.find(m => m.id === matchId) || historyMatches.find(m => m.id === matchId)
    
    const [messages, setMessages] = useState<MessageType[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [isSending, setIsSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const isOnline = match?.status === 'active'

    const prevMatchId = useRef<number | null>(null)

    useEffect(() => {
        if (!match) return

        let isMounted = true
        const fetchMessages = async () => {
            try {
                const fetchedMessages = await getMatchMessages(match.id)
                if (isMounted) {
                    // Only update state if count changed or match changed
                    setMessages(prev => {
                        if (prev.length !== fetchedMessages.length || prevMatchId.current !== match.id) {
                            return fetchedMessages
                        }
                        return prev
                    })
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
    }, [match])

    useEffect(() => {
        if (scrollRef.current) {
            const container = scrollRef.current
            const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 150 // 150px threshold
            const isNewMatch = prevMatchId.current !== match?.id
            
            // Scroll if new match selected OR if we were already at bottom
            if (isNewMatch || isAtBottom) {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: isNewMatch ? "auto" : "smooth"
                })
            }
            
            if (match) prevMatchId.current = match.id
        }
    }, [messages, match?.id])

    const handleSendMessage = async () => {
        if (!match || !newMessage.trim() || !isOnline || isSending) return

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

    if (!match) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center opacity-80">
                <p>Δεν βρέθηκε η συνομιλία</p>
            </div>
        )
    }

    const getInitials = (name: string) => {
        return name ? (name.charAt(0).toUpperCase() + (name.split(' ')?.[1]?.charAt(0)?.toUpperCase() ?? '')) : "?"
    }

    return (
        <div className="flex-1 flex flex-col relative h-full">
            <div className="h-20 px-4 sm:px-8 border-b border-border bg-card flex items-center justify-between flex-shrink-0 shadow-soft z-10 w-full">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.push('/matches')}
                        className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    
                    <div className="relative">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                            isOnline ? 'bg-amber-50 border-amber-100 text-amber-500' : 'bg-muted border-border text-muted-foreground grayscale'
                        } border`}>
                            {getInitials(match.user.fullName)}
                        </div>
                        {isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full bg-emerald-500"></div>}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-foreground tracking-tight leading-tight">{match.user.fullName}</h3>
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {match.user.currentZone.name}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3">
                    {isOnline ? (
                        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-100 uppercase tracking-wide">
                            Ενεργο Match
                        </span>
                    ) : (
                        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border uppercase tracking-wide">
                            Ανενεργο
                        </span>
                    )}
                    <button className="text-muted-foreground hover:text-primary hover:bg-primary-soft p-2 rounded-xl transition-colors cursor-pointer">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-surface-dim/50">
                <div className="flex justify-center mb-6 mt-2">
                    <div className="bg-primary-soft border border-primary/20 text-primary text-[11px] sm:text-xs font-semibold px-4 py-2 rounded-2xl flex items-center gap-2 shadow-soft text-center">
                        <Sparkles className="w-4 h-4 flex-shrink-0" />
                        Το σύστημα εντόπισε αντιστοιχία στις {format(new Date(match.matchDate), "d MMM yyyy", { locale: el })}
                    </div>
                </div>

                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2 h-full opacity-50 pb-20">
                        <span className="material-symbols-outlined text-4xl">{isOnline ? 'chat' : 'history'}</span>
                        <p className="text-sm">Δεν υπάρχουν μηνύματα ακόμη.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMine = msg.senderProfile?.user?.id === currentUserId
                        const showDateBreak = index === 0 || format(new Date(msg.createdAt), "d MMM yyyy") !== format(new Date(messages[index - 1].createdAt), "d MMM yyyy")

                        return (
                            <React.Fragment key={msg.id}>
                                {showDateBreak && (
                                    <div className="flex justify-center mb-4 mt-6">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-card border border-border px-3 py-1 rounded-full shadow-soft">
                                            {format(new Date(msg.createdAt), "d MMMM yyyy", { locale: el })}
                                        </span>
                                    </div>
                                )}
                                {isMine ? (
                                    <div className={`flex items-end gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] ml-auto flex-row-reverse group/msg ${!isOnline ? 'opacity-70' : ''}`}>
                                        <div className="flex flex-col gap-1 items-end">
                                            <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-br-none text-[13px] sm:text-[14px] bg-primary text-white shadow-soft leading-relaxed">
                                                {msg.content}
                                            </div>
                                            <div className={`flex items-center gap-1 mr-1 ${isOnline ? 'opacity-0 group-hover/msg:opacity-100 transition-opacity' : ''}`}>
                                                <span className="text-[10px] font-medium text-muted-foreground">{format(new Date(msg.createdAt), "HH:mm")}</span>
                                                {isOnline && <CheckCheck className="w-3.5 h-3.5 text-primary" />}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`flex items-end gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] group/msg ${!isOnline ? 'opacity-70' : ''}`}>
                                        <div className="hidden sm:flex w-8 h-8 rounded-full flex-shrink-0 border border-border shadow-soft font-bold items-center justify-center text-xs text-amber-500 bg-card">
                                            {getInitials(match.user.fullName)}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="bg-card p-3.5 sm:p-4 rounded-2xl sm:rounded-bl-none shadow-soft border border-border text-foreground text-[13px] sm:text-[14px] leading-relaxed">
                                                {msg.content}
                                            </div>
                                            <span className={`text-[10px] font-medium text-muted-foreground ml-1 ${isOnline ? 'opacity-0 group-hover/msg:opacity-100 transition-opacity' : ''}`}>
                                                {format(new Date(msg.createdAt), "HH:mm")}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        )
                    })
                )}
            </div>

            {isOnline ? (
                <div className="p-4 sm:p-6 bg-card border-t border-border z-10 flex-shrink-0">
                    <div className="flex items-end gap-2 sm:gap-3">
                        <button className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary-soft rounded-xl transition-colors cursor-pointer">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <div className="flex-1 relative">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                rows={1} 
                                className="w-full bg-muted border border-border focus:border-primary focus:ring-[3px] focus:ring-primary/15 rounded-2xl py-3 sm:py-3.5 px-4 sm:px-5 text-sm outline-none resize-none transition-all text-foreground" 
                                placeholder="Γράψτε ένα μήνυμα..."
                                disabled={isSending}
                            />
                        </div>
                        <button 
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || isSending}
                            className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-primary hover:bg-primary-hover text-white rounded-xl flex items-center justify-center shadow-floating transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 sm:ml-1" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-4 sm:p-6 bg-card border-t border-border z-10 flex-shrink-0">
                    <div className="w-full bg-muted border border-border rounded-xl py-4 flex items-center justify-center text-sm font-medium text-muted-foreground gap-2">
                        <Lock className="w-4 h-4" />
                        Η συνομιλία έχει αρχειοθετηθεί
                    </div>
                </div>
            )}
        </div>
    )
}
