"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function MatchBanner() {
    return (
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 shadow-sm shadow-teal-900/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between py-2.5 gap-3">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-2 w-2 relative flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <p className="text-[13px] font-semibold text-white tracking-wide">
                            Βρέθηκε ενεργό match! Ένας εκπαιδευτικός πληροί τα κριτήριά σας.
                        </p>
                    </div>
                    <Link href="/matches" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto text-[11px] font-bold text-teal-700 bg-white hover:bg-teal-50 px-4 py-1.5 rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer">
                            Προβολή
                            <ArrowRight className="w-3 h-3" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
