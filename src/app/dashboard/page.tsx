import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { getUserProfile, getTransferRequest } from "@/actions/request";
import { redirect } from "next/navigation";
import {
    MapPin,
    Eye,
    Radio,
    FileEdit,
    BadgeCheck,
    Building2,
    Plus,
    LayoutDashboard,
    Users,
    Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Dashboard() {
    const session = await auth();
    const user = session?.user;

    // 1. GUEST VIEW - Redirect to Login
    if (!user) {
        redirect("/login");
    }

    // 2. FETCH DATA
    const profile = await getUserProfile();

    if (!profile) {
        return (
            <div className="container mx-auto py-20 text-center space-y-6">
                <h2 className="text-3xl font-bold">Καλωσήρθατε, {user.name || "Χρήστη"}!</h2>
                <p className="text-lg text-muted-foreground">Για να ξεκινήσετε τη διαδικασία matching, πρέπει πρώτα να δημιουργήσετε το επαγγελματικό σας προφίλ.</p>
                <Link href="/profile">
                    <Button>Δημιουργία Προφίλ</Button>
                </Link>
            </div>
        )
    }

    const request = await getTransferRequest();

    if (!request) {
        return (
            <div className="container mx-auto py-20 space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Το Προφίλ μου: {profile.specialty.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.currentZone.name}</span>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center space-y-4">
                    <h3 className="text-xl font-semibold text-blue-900">Δεν έχετε ενεργή αίτηση μετάθεσης.</h3>
                    <p className="text-blue-700">Δηλώστε τις περιοχές που επιθυμείτε να μετατεθείτε για να βρούμε το ταίρι σας.</p>
                    <Link href="/request/create">
                        <Button size="lg" className="mt-4">Υποβολή Αίτησης</Button>
                    </Link>
                </div>
            </div>
        )
    }

    // 3. RENDER DASHBOARD
    return (
        <div className="min-h-screen pt-20 bg-slate-50/50 dark:bg-slate-950 flex flex-col">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Active Request Card */}
                        <div className="relative overflow-hidden rounded-2xl glass-card">
                            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="p-6 sm:p-8 relative z-10">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                                            Transfer Request
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono">
                                                #TR-{request.id}
                                            </span>
                                        </h2>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-sm text-slate-500">Submitted on <span className="text-slate-700 dark:text-slate-300 font-medium">{request.createdAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span></span>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                                        Active Status
                                    </span>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-slate-800 mb-8">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 flex-shrink-0 border border-blue-200 dark:border-blue-800">
                                            <Eye className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Profile Visibility: High</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-2xl">
                                                Your request is currently active in the national pool. Officers from your designated target zones can view your anonymized profile details.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                                    <Link href="/request/create" className="flex-1 sm:flex-none">
                                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98]">
                                            Edit Request Details
                                        </button>
                                    </Link>
                                    <button className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                        Withdraw
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Scanning Card */}
                        <div className="scanning-pulse relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-[#1e3a8a] border border-blue-800/50 shadow-xl shadow-blue-900/10">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>
                            <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                                <div className="flex-shrink-0 relative">
                                    <div className="w-24 h-24 relative flex items-center justify-center">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-20 animate-ping" style={{ animationDuration: '3s' }}></span>
                                        <span className="absolute inline-flex h-[140%] w-[140%] rounded-full bg-blue-400 opacity-10 animate-pulse"></span>
                                        <div className="relative w-20 h-20 rounded-full bg-blue-950 border border-blue-700/50 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                            <Radio className="w-10 h-10 text-blue-400 animate-pulse" />
                                            <div className="absolute inset-0 rounded-full border-t-2 border-blue-500/30 animate-spin" style={{ animationDuration: '4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow w-full">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-white">Scanning for Matches...</h3>
                                        <span className="text-xs font-mono text-blue-300 bg-blue-900/60 px-2 py-1 rounded border border-blue-800">REALTIME</span>
                                    </div>
                                    <p className="text-blue-100/80 text-sm mb-6 max-w-lg leading-relaxed">
                                        Our algorithm is currently analyzing mutual transfer opportunities based on your target zones and profile criteria.
                                    </p>
                                    <div className="w-full bg-blue-950/50 rounded-full h-1.5 mb-4 overflow-hidden shadow-inner border border-blue-900/30">
                                        <div className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 h-full rounded-full w-3/4 animate-shimmer relative overflow-hidden">
                                            <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full animate-shimmer"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-blue-300/80 font-mono">
                                        <span>Phase 1: Zone Analysis</span>
                                        <span className="text-blue-200 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span> Live Connection</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Profile Summary */}
                        <div className="glass-card rounded-2xl h-fit">
                            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 rounded-t-2xl">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Profile Summary</h3>
                                <Link href="/profile">
                                    <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <FileEdit className="w-5 h-5" />
                                    </button>
                                </Link>
                            </div>
                            <div className="p-5 space-y-5">
                                {/* Designation */}
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                                        <BadgeCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Designation</p>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{profile.specialty.name}</p>
                                    </div>
                                </div>
                                {/* Department */}
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition-colors">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Department</p>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{profile.division.name}</p>
                                    </div>
                                </div>
                                {/* Current Zone */}
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40 transition-colors">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Current Zone</p>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{profile.currentZone.name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-5 pb-5">
                                <Link href="/profile" className="flex items-center justify-center w-full py-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700">
                                    View Full Profile
                                </Link>
                            </div>
                        </div>

                        {/* Target Zones */}
                        <div className="glass-card rounded-2xl flex flex-col h-fit">
                            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-2xl">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Target Zones</h3>
                                    <Link href="/request/create">
                                        <button className="text-blue-600 hover:text-white hover:bg-blue-600 p-1 rounded transition-all">
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </Link>
                                </div>
                                <p className="text-[10px] text-slate-500">Prioritized list of desired locations</p>
                            </div>
                            <div className="p-3 space-y-2">
                                {request.targetZones.map((target, index) => (
                                    <div key={target.id} className="group flex items-center p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer">
                                        <div className="flex-shrink-0 mr-3">
                                            <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-700 group-hover:border-blue-200 group-hover:bg-blue-50">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{target.zone.name}</h4>
                                                {index === 0 && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-100 text-red-600 border border-red-200">
                                                        High
                                                    </span>
                                                )}
                                                {index === 1 && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-600 border border-amber-200">
                                                        Med
                                                    </span>
                                                )}
                                                {index > 1 && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-100 text-blue-600 border border-blue-200">
                                                        Low
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-t border-slate-200 dark:border-slate-800 mt-auto">
                                <Link href="/request/create" className="block w-full text-center text-[10px] font-medium text-slate-500 hover:text-blue-600 transition-colors py-1">
                                    Manage Preferences
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE BOTTOM NAV */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
                <div className="flex justify-around items-center h-16 px-2">
                    <button className="flex flex-col items-center justify-center w-full h-full text-blue-600">
                        <LayoutDashboard className="w-6 h-6" />
                        <span className="text-[10px] font-medium mt-1">Home</span>
                    </button>
                    <button className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                        <Users className="w-6 h-6" />
                        <span className="text-[10px] font-medium mt-1">Matches</span>
                    </button>
                    <div className="relative -top-5">
                        <Link href="/request/create">
                            <button className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center transform transition-transform active:scale-95 border-2 border-white dark:border-slate-900">
                                <Plus className="w-6 h-6" />
                            </button>
                        </Link>
                    </div>
                    <button className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                        <Bell className="w-6 h-6" />
                        <span className="text-[10px] font-medium mt-1">Alerts</span>
                    </button>
                    <button className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 ring-1 ring-slate-300 dark:ring-slate-700">
                            <Avatar className="w-full h-full">
                                <AvatarImage src={user.image || undefined} />
                                <AvatarFallback className="text-[10px]">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                        <span className="text-[10px] font-medium mt-1">Profile</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
