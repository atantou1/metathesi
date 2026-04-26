"use client"

import { useState, useTransition } from "react"
import { deleteTransferRequest } from "@/actions/request"
import { useRouter } from "next/navigation"
import { AlertCircle, X } from "lucide-react"

export function DeleteRequestButton() {
    const [isPending, startTransition] = useTransition()
    const [showConfirm, setShowConfirm] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        startTransition(async () => {
            const result = await deleteTransferRequest()
            if (result.error) {
                alert(`Error: ${result.error}`)
            } else {
                setShowConfirm(false)
                router.refresh()
            }
        })
    }

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                disabled={isPending}
                className="flex-1 sm:flex-none bg-card border border-danger/20 hover:bg-danger-soft text-danger px-8 py-3.5 rounded-2xl text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
                {isPending ? "Διαγραφή..." : "Διαγραφή"}
            </button>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div 
                        className="glass-card w-full max-w-md overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with Close Button */}
                        <div className="p-6 flex justify-between items-start">
                            <div className="w-12 h-12 rounded-2xl bg-danger-soft flex items-center justify-center text-danger">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <button 
                                onClick={() => setShowConfirm(false)}
                                className="p-2 rounded-xl hover:bg-muted text-text-quaternary transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 pb-6 text-center sm:text-left">
                            <h3 className="text-xl font-bold text-foreground mb-2">Διαγραφή Αίτησης;</h3>
                            <p className="text-text-tertiary text-sm leading-relaxed">
                                Είστε σίγουροι ότι θέλετε να διαγράψετε την αίτησή σας; Η ενέργεια αυτή θα ακυρώσει τυχόν ενεργά ταιριάσματα και η αίτησή σας δεν θα είναι πλέον ορατή σε άλλους χρήστες.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-surface-dim/50 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 px-6 py-3 rounded-2xl border border-border bg-white text-text-tertiary font-semibold text-sm hover:bg-surface-dim transition-colors"
                            >
                                Ακύρωση
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="flex-1 px-6 py-3 rounded-2xl bg-danger text-danger-foreground font-semibold text-sm hover:bg-danger/90 transition-colors shadow-lg shadow-danger/20 flex items-center justify-center cursor-pointer"
                            >
                                {isPending ? "Διαγραφή..." : "Ναι, Διαγραφή"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
