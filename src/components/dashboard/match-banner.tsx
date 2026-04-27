"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function MatchBanner() {
    return (
        <div className="bg-gradient-to-r from-tech-card-start to-primary px-6 sm:px-8 py-3.5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-2 w-2 relative flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white dark:bg-primary-bright opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white dark:bg-primary-bright"></span>
                    </span>
                    <p className="text-[13px] font-semibold text-white tracking-wide">
                        <span className="hidden sm:inline">Βρέθηκε ενεργό match! Ένας εκπαιδευτικός πληροί τα κριτήριά σας.</span>
                        <span className="inline sm:hidden">Βρέθηκε μια αντιστοίχιση</span>
                    </p>
                </div>
                <Link href="/matches" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto text-[11px] font-bold text-primary dark:text-primary-foreground bg-white dark:bg-primary hover:bg-white/90 dark:hover:bg-primary/90 px-4 py-1.5 rounded-full transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer border border-transparent dark:border-primary-bright/20">
                        Προβολή
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </Link>
            </div>
        </div>
    )
}
