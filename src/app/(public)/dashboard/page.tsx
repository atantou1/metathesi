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
    SlidersHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteRequestButton } from "@/components/dashboard/delete-request-button";
import { MatchBanner } from "@/components/dashboard/match-banner";

const PopularityBadge = ({ popularity }: { popularity: number }) => {
    let label = "ΧΑΜΗΛΗ";
    let colorClass = "bg-teal-50 text-teal-600 border-teal-100";

    if (popularity >= 2.0) {
        label = "ΜΕΓΙΣΤΗ";
        colorClass = "bg-rose-50 text-rose-600 border-rose-100";
    } else if (popularity >= 1.2) {
        label = "ΥΨΗΛΗ";
        colorClass = "bg-amber-50 text-amber-600 border-amber-100";
    } else if (popularity >= 0.5) {
        label = "ΜΕΣΗ";
        colorClass = "bg-sky-50 text-sky-600 border-sky-100";
    }

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${colorClass} border`}>
            {label}
        </span>
    );
};

export default async function Dashboard() {
    const session = await auth();
    const user = session?.user;

    // 1. GUEST VIEW - Redirect to Login
    if (!user) {
        redirect("/login");
    }

    // 2. ADMIN REDIRECT - Send admins to their dedicated panel
    if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
        redirect("/admin");
    }

    // 2. FETCH DATA
    // 2. FETCH DATA
    const profile = await getUserProfile();

    // REMOVED: The "Welcome User" screen that was here (lines 34-44) is now replaced by the logic below 
    // which handles the "no profile" case within the main dashboard layout.

    const request = await getTransferRequest();

    if (!request) {
        return (
            <div className="min-h-screen pt-20 flex flex-col">
                <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* No Active Request Card */}
                            <div className="glass-card rounded-[2rem] overflow-hidden relative">
                                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-sky-100/40 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="p-8 sm:p-12 flex flex-col items-center text-center relative z-10">
                                    <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-[#0369A1] shadow-lg shadow-sky-500/20 rounded-full flex items-center justify-center mb-6 relative">
                                        <MapPin className="text-white w-12 h-12" />
                                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#0369A1] rounded-full flex items-center justify-center border-4 border-white">
                                            <Plus className="text-white w-5 h-5" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-3">Δεν έχετε ενεργή αίτηση</h2>
                                    <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed text-sm">
                                        Ξεκινήστε τώρα τη διαδικασία για να βρείτε την ιδανική αμοιβαία μετάθεση. Η διαδικασία είναι απλή και γρήγορη.
                                    </p>
                                    <Link href="/request/create">
                                        <button className="w-full sm:w-auto bg-[#0369A1] hover:bg-[#075985] text-white px-8 py-3.5 rounded-[1.25rem] text-sm font-semibold transition-all shadow-lg shadow-sky-900/10 active:scale-[0.98] flex items-center justify-center gap-2">
                                            <Plus className="w-5 h-5" />
                                            Δημιουργία Νέας Αίτησης
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* How it works */}
                            <div className="glass-card rounded-[2rem] p-6 sm:p-8">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
                                    <div className="p-2 rounded-2xl bg-sky-50 text-[#0369A1]">
                                        <Eye className="w-5 h-5" />
                                    </div>
                                    Πώς λειτουργεί το metaThesi;
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 font-bold text-sm border border-slate-100">1</div>
                                        <h4 className="font-semibold text-slate-800 text-sm">Δημιουργία Προφίλ</h4>
                                        <p className="text-xs leading-relaxed text-slate-500 font-medium">Καταχωρήστε τα στοιχεία της οργανικής σας θέσης και τις περιοχές που σας ενδιαφέρουν.</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 font-bold text-sm border border-slate-100">2</div>
                                        <h4 className="font-semibold text-slate-800 text-sm">Αυτόματη Αναζήτηση</h4>
                                        <p className="text-xs leading-relaxed text-slate-500 font-medium">Ο αλγόριθμός μας αναζητά συνεχώς συμβατές αιτήσεις σε πραγματικό χρόνο.</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 font-bold text-sm border border-slate-100">3</div>
                                        <h4 className="font-semibold text-slate-800 text-sm">Επικοινωνία & Ταυτοποίηση</h4>
                                        <p className="text-xs leading-relaxed text-slate-500 font-medium">Μόλις βρεθεί ταίριασμα, ενημερώνεστε αμέσως για να ξεκινήσετε τη διαδικασία.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Profile Summary - Only show if profile exists */}
                            {profile && (
                                <div className="glass-card rounded-[2rem] h-fit overflow-hidden">
                                    <div className="p-6 border-b border-sky-50 flex justify-between items-center bg-white/50">
                                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Σύνοψη Προφίλ</h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        {/* Designation */}
                                        <div className="flex items-center gap-5 group">
                                            <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50 group-hover:bg-indigo-100/80 transition-colors">
                                                <BadgeCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ΒΑΘΜΙΔΑ</p>
                                                <p className="text-sm font-medium text-slate-700">{profile.division.name}</p>
                                            </div>
                                        </div>
                                        {/* Department */}
                                        <div className="flex items-center gap-5 group">
                                            <div className="w-12 h-12 rounded-[1.25rem] bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100/50 group-hover:bg-orange-100/80 transition-colors">
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ΕΙΔΙΚΟΤΗΤΑ</p>
                                                <p className="text-sm font-medium text-slate-700">{profile.specialty.name}</p>
                                            </div>
                                        </div>
                                        {/* Current Zone */}
                                        <div className="flex items-center gap-5 group">
                                            <div className="w-12 h-12 rounded-[1.25rem] bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100/50 group-hover:bg-teal-100/80 transition-colors">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ΤΡΕΧΟΥΣΑ ΘΕΣΗ</p>
                                                <p className="text-sm font-medium text-slate-700">{profile.currentZone.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Help Box */}
                            <div className="bg-[#0369A1] rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl shadow-[#0369A1]/20">
                                <div className="relative z-10">
                                    <div className="mb-4 text-sky-200">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold mb-2 tracking-tight">Χρειάζεστε βοήθεια;</h4>
                                    <p className="text-sm text-sky-100 mb-4 opacity-90 leading-relaxed font-light">
                                        Δείτε τον οδηγό χρήσης ή επικοινωνήστε με την υποστήριξη για οποιαδήποτε απορία.
                                    </p>
                                    <Link href="#" className="inline-flex items-center text-sm font-semibold hover:text-sky-200 transition-colors">
                                        Κέντρο Βοήθειας
                                    </Link>
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Reusing existing Mobile Nav at the bottom of the main Dashboard if needed, 
                    but strictly following the user's provided HTML structure which had a simple footer.
                    However, keeping consistent with the active dashboard's existing footer structure is safer.*/}
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
        )
    }

    // 3. RENDER DASHBOARD
    // Safety check for TS - if request exists, profile should exist given getTransferRequest logic,
    // but we need to assure TS of this.
    if (!profile) return null;

    const hasActiveMatch = request.matchParticipations && request.matchParticipations.length > 0;

    return (
        <div className="min-h-screen pt-20 flex flex-col">
            {hasActiveMatch && <MatchBanner />}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Active Request Card with Embedded Scanning Block */}
                        <div className="relative overflow-hidden rounded-[2rem] glass-card">
                            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-sky-100/40 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="p-6 sm:p-8 relative z-10">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                                            Αίτηση Αμοιβαίας
                                            <span className="px-2.5 py-1 rounded-lg text-[10px] bg-slate-50 border border-slate-200 text-slate-500 font-mono tracking-wider">
                                                #TR-{request.id}
                                            </span>
                                        </h2>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-sm text-slate-500">Υποβλήθηκε στις <span className="text-slate-700 font-medium">{request.createdAt.toLocaleDateString("el-GR", { month: 'short', day: 'numeric', year: 'numeric' })}</span></span>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100 shadow-sm shadow-sky-900/5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-2.5 animate-pulse"></span>
                                        Ενεργή
                                    </span>
                                </div>

                                {/* Scanning Block Embedded */}
                                <div className="scanning-pulse relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-blue-900 border border-blue-800/50 shadow-xl shadow-sky-900/10 mb-8">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                                    <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-l from-blue-900/40 via-sky-900/20 to-transparent"></div>
                                    <div className="relative p-8 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                                        <div className="flex-shrink-0 relative">
                                            <div className="w-20 h-20 relative flex items-center justify-center">
                                                <span className="absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-20 animate-ping" style={{ animationDuration: '3s' }}></span>
                                                <span className="absolute inline-flex h-[130%] w-[130%] rounded-full bg-sky-400 opacity-10 animate-pulse"></span>
                                                <div className="relative w-16 h-16 rounded-full bg-slate-950 border border-sky-700/50 flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.2)]">
                                                    <Radio className="w-8 h-8 text-sky-400 animate-pulse" />
                                                    <div className="absolute inset-0 rounded-full border-t-2 border-sky-500/30 animate-spin" style={{ animationDuration: '4s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-grow w-full pt-1">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-lg font-semibold text-white tracking-wide">Σάρωση για Αμοιβαίες...</h3>
                                                <span className="text-[10px] font-mono text-sky-300 bg-sky-900/40 px-2 py-1 rounded-lg border border-sky-800/50 tracking-wider">REALTIME</span>
                                            </div>
                                            <p className="text-slate-300 text-sm mb-5 leading-relaxed font-light">
                                                Ο αλγόριθμος αναζητά ευκαιρίες αμοιβαίας μετάθεσης στις Περιοχές Προτίμησής σας.
                                            </p>
                                            <div className="w-full bg-slate-800/80 rounded-full h-2 mb-4 overflow-hidden shadow-inner border border-slate-700/50">
                                                <div className="bg-gradient-to-r from-sky-600 via-sky-400 to-blue-500 h-full rounded-full w-3/4 animate-[shimmer_3s_infinite] relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
                                                <span>Φάση : Ανάλυση Περιοχών</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* "My Preferences" Block */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-slate-800 tracking-wide flex items-center gap-2">
                                            Οι Προτιμήσεις μου
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {request.targetZones.map((target, index) => (
                                            <div key={target.id} className="group flex items-center p-3 rounded-[1.25rem] bg-white border border-slate-100 hover:border-sky-200 hover:bg-sky-50 transition-all shadow-sm">
                                                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold mr-3 group-hover:border-sky-200 group-hover:text-sky-600 group-hover:bg-sky-50 transition-colors">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="text-sm font-medium text-slate-700 truncate max-w-[100px]">{target.zone.name}</h4>
                                                        <PopularityBadge popularity={(target as any).popularity || 0} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-6">
                                    <Link href="/request/create" className="flex-1 sm:flex-none">
                                        <button className="w-full bg-[#0369A1] hover:bg-[#075985] text-white px-8 py-3.5 rounded-[1.25rem] text-sm font-semibold transition-all shadow-lg shadow-sky-900/10 active:scale-[0.98] cursor-pointer">
                                            Επεξεργασία
                                        </button>
                                    </Link>
                                    <DeleteRequestButton />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Profile Summary */}
                        <div className="glass-card rounded-[2rem] h-fit overflow-hidden">
                            <div className="p-6 border-b border-sky-50 flex justify-between items-center bg-white/50">
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Σύνοψη Προφίλ</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Designation */}
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50 group-hover:bg-indigo-100/80 transition-colors">
                                        <BadgeCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ΒΑΘΜΙΔΑ</p>
                                        <p className="text-sm font-medium text-slate-700">{profile.division.name}</p>
                                    </div>
                                </div>
                                {/* Department */}
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-[1.25rem] bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100/50 group-hover:bg-orange-100/80 transition-colors">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ΕΙΔΙΚΟΤΗΤΑ</p>
                                        <p className="text-sm font-medium text-slate-700">{profile.specialty.name}</p>
                                    </div>
                                </div>
                                {/* Current Zone */}
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-[1.25rem] bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100/50 group-hover:bg-teal-100/80 transition-colors">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ΤΡΕΧΟΥΣΑ ΘΕΣΗ</p>
                                        <p className="text-sm font-medium text-slate-700">{profile.currentZone.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Target Zones */}
                        <div className="glass-card rounded-[2rem] flex flex-col overflow-hidden h-fit">
                            <div className="p-6 border-b border-sky-50 bg-white/50">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">ΖΗΤΗΣΗ ΠΕΡΙΟΧΩΝ</h3>
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                {request.targetZones.map((target, index) => (
                                    <div key={target.id} className="group flex items-center p-3 rounded-[1.25rem] hover:bg-sky-50 border border-transparent hover:border-sky-100 transition-all">
                                        <div className="flex-shrink-0 mr-4">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-sky-600 transition-colors border border-slate-100 group-hover:border-sky-200 group-hover:bg-sky-50">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="text-sm font-medium text-slate-700 truncate">{target.zone.name}</h4>
                                                <PopularityBadge popularity={(target as any).popularity || 0} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE BOTTOM NAV */}

        </div>
    );
}
