import React from "react"
import { Satellite } from "lucide-react"

export default function MatchesPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center opacity-80 w-full">
            <div className="w-16 h-16 bg-card border border-border shadow-soft rounded-full flex items-center justify-center text-primary mb-4">
                <Satellite className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-2">Καμία επιλεγμένη συνομιλία</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[250px]">
                Επιλέξτε ένα ενεργό match σας ή μια παλαιότερη συνομιλία από τα αριστερά για να δείτε τα μηνύματα ή την κατάσταση της αντιστοίχισης.
            </p>
        </div>
    )
}
