import React from "react"
import { Satellite } from "lucide-react"

export default function MatchesPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center opacity-80 w-full">
            <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center text-[#0369a1] mb-4">
                <Satellite className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-700 mb-2">Καμία επιλεγμένη συνομιλία</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[250px]">
                Επιλέξτε ένα ενεργό match σας ή μια παλαιότερη συνομιλία από τα αριστερά για να δείτε τα μηνύματα ή την κατάσταση της αντιστοίχισης.
            </p>
        </div>
    )
}
