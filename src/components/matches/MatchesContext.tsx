"use client";
import React, { createContext, useContext } from "react";
import { MatchResult } from "@/lib/matching";

interface MatchesContextType {
    activeMatches: MatchResult[];
    historyMatches: MatchResult[];
    currentUserId: number;
}

export const MatchesContext = createContext<MatchesContextType | null>(null);

export function useMatches() {
    const context = useContext(MatchesContext);
    if (!context) {
        throw new Error("useMatches must be used within a MatchesLayoutProvider");
    }
    return context;
}
