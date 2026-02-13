
import Link from "next/link"
import { School, Star, ShieldCheck } from "lucide-react"

interface AuthLayoutProps {
    children: React.ReactNode
    title: string
    subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="w-full h-screen lg:flex overflow-hidden bg-white dark:bg-slate-900">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-slate-900/90 z-10"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>

                <div className="relative z-20 text-center px-12 max-w-xl">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm text-white mb-8 border border-white/10 shadow-lg">
                        <School className="w-10 h-10" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Public Sector Mutual Matcher</h2>
                    <p className="text-lg text-slate-300 leading-relaxed font-light">
                        Η επίσημη πλατφόρμα για τη διαχείριση αμοιβαίων μεταθέσεων στο δημόσιο τομέα.
                        Απλοποιήστε τη διαδικασία κινητικότητας με ασφάλεια και εγκυρότητα.
                    </p>
                    <div className="mt-12 flex justify-center gap-4">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs text-white">JD</div>
                            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-600 flex items-center justify-center text-xs text-white">AS</div>
                            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-500 flex items-center justify-center text-xs text-white">MK</div>
                        </div>
                        <div className="flex items-center text-sm text-slate-300 font-medium">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            Εμπιστεύονται 10k+ Εκπαιδευτικοί
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col h-full bg-white dark:bg-slate-900 relative">
                <div className="lg:hidden h-1 w-full bg-blue-600/10 dark:bg-blue-600/5 absolute top-0 left-0"></div>
                <div className="flex-1 flex flex-col justify-center px-8 py-10 sm:px-12 lg:px-20 xl:px-24 overflow-y-auto no-scrollbar">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="lg:hidden inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600/10 text-blue-600 mb-6 shadow-sm">
                            <School className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                            {title}
                        </h1>
                        <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                            {subtitle}
                        </p>
                    </div>

                    {children}

                    <div className="mt-auto text-center lg:text-left pt-6">
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center lg:justify-start space-x-2 opacity-80">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Public Sector Verified</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
