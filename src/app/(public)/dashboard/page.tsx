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
    let colorClass = "bg-success-soft text-success border-success/20";

    if (popularity >= 2.0) {
        label = "ΜΕΓΙΣΤΗ";
        colorClass = "bg-danger-soft text-danger border-danger/20";
    } else if (popularity >= 1.2) {
        label = "ΥΨΗΛΗ";
        colorClass = "bg-warning-soft text-warning border-warning/20";
    } else if (popularity >= 0.5) {
        label = "ΜΕΣΗ";
        colorClass = "bg-primary-soft text-primary border-primary/20";
    }

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-2xl text-[9px] font-bold uppercase ${colorClass} border`}>
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
            <div className="min-h-screen pt-20 flex flex-col items-center">
                <main className="w-full max-w-7xl px-4 lg:px-0 py-8 flex-grow">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* No Active Request Card */}
                            <div className="glass-card rounded-4xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="p-8 sm:p-12 flex flex-col items-center text-center relative z-10">
                                    <div className="w-24 h-24 bg-gradient-to-br from-primary/60 to-primary shadow-lg shadow-primary/20 rounded-full flex items-center justify-center mb-6 relative">
                                        <MapPin className="text-white w-12 h-12" />
                                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-background">
                                            <Plus className="text-white w-5 h-5" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground tracking-tight mb-3">Δεν έχετε ενεργή αίτηση</h2>
                                    <p className="text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed text-sm">
                                        Ξεκινήστε τώρα τη διαδικασία για να βρείτε την ιδανική αμοιβαία μετάθεση. Η διαδικασία είναι απλή και γρήγορη.
                                    </p>
                                    <Link href="/request/create">
                                        <button className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-soft active:scale-[0.98] flex items-center justify-center gap-2">
                                            <Plus className="w-5 h-5" />
                                            Δημιουργία Νέας Αίτησης
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* How it works */}
                            <div className="glass-card rounded-4xl p-6 sm:p-8">
                                <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-3">
                                    <div className="p-2 rounded-2xl bg-primary-soft text-primary">
                                        <Eye className="w-5 h-5" />
                                    </div>
                                    Πώς λειτουργεί το metaThesi;
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                        <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-text-secondary font-bold text-sm border border-border-dim">1</div>
                                        <h4 className="font-semibold text-foreground text-sm">Δημιουργία Προφίλ</h4>
                                        <p className="text-xs leading-relaxed text-text-tertiary font-medium">Καταχωρήστε τα στοιχεία της οργανικής σας θέσης και τις περιοχές που σας ενδιαφέρουν.</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="w-10 h-10 rounded-2xl bg-surface-dim flex items-center justify-center text-text-secondary font-bold text-sm border border-border-dim">2</div>
                                        <h4 className="font-semibold text-foreground text-sm">Αυτόματη Αναζήτηση</h4>
                                        <p className="text-xs leading-relaxed text-text-tertiary font-medium">Ο αλγόριθμός μας αναζητά συνεχώς συμβατές αιτήσεις σε πραγματικό χρόνο.</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="w-10 h-10 rounded-2xl bg-surface-dim flex items-center justify-center text-text-secondary font-bold text-sm border border-border-dim">3</div>
                                        <h4 className="font-semibold text-foreground text-sm">Επικοινωνία & Ταυτοποίηση</h4>
                                        <p className="text-xs leading-relaxed text-text-tertiary font-medium">Μόλις βρεθεί ταίριασμα, ενημερώνεστε αμέσως για να ξεκινήσετε τη διαδικασία.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Profile Summary - Only show if profile exists */}
                            {profile && (
                                <div className="glass-card rounded-4xl h-fit overflow-hidden">
                                    <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-card/50">
                                        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Σύνοψη Προφίλ</h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        {/* Designation */}
                                        <div className="flex items-center gap-5 group">
                                            <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center text-primary border border-border group-hover:bg-primary/20 transition-colors">
                                                <BadgeCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-text-quaternary uppercase tracking-wider mb-1">ΒΑΘΜΙΔΑ</p>
                                                <p className="text-sm font-medium text-foreground">{profile.division.name}</p>
                                            </div>
                                        </div>
                                        {/* Department */}
                                        <div className="flex items-center gap-5 group">
                                            <div className="w-12 h-12 rounded-2xl bg-warning-soft flex items-center justify-center text-warning border border-warning/20 group-hover:bg-warning/20 transition-colors">
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-text-quaternary uppercase tracking-wider mb-1">ΕΙΔΙΚΟΤΗΤΑ</p>
                                                <p className="text-sm font-medium text-text-secondary">{profile.specialty.name}</p>
                                            </div>
                                        </div>
                                        {/* Current Zone */}
                                        <div className="flex items-center gap-5 group">
                                            <div className="w-12 h-12 rounded-2xl bg-success-soft flex items-center justify-center text-success border border-success/20 group-hover:bg-success/20 transition-colors">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-text-quaternary uppercase tracking-wider mb-1">ΤΡΕΧΟΥΣΑ ΘΕΣΗ</p>
                                                <p className="text-sm font-medium text-text-secondary">{profile.currentZone.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Help Box */}
                            <div className="bg-primary rounded-2xl p-6 text-white relative overflow-hidden shadow-floating">
                                <div className="relative z-10">
                                    <div className="mb-4 text-primary-foreground/80">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold mb-2 tracking-tight">Χρειάζεστε βοήθεια;</h4>
                                    <p className="text-sm text-primary-foreground/90 mb-4 opacity-90 leading-relaxed font-light">
                                        Δείτε τον οδηγό χρήσης ή επικοινωνήστε με την υποστήριξη για οποιαδήποτε απορία.
                                    </p>
                                    <Link href="#" className="inline-flex items-center text-sm font-semibold hover:text-white/80 transition-colors">
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
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/90 dark:bg-card/90 backdrop-blur-md border-t border-border dark:border-border pb-safe z-50">
                    <div className="flex justify-around items-center h-16 px-2">
                        <button className="flex flex-col items-center justify-center w-full h-full text-primary">
                            <LayoutDashboard className="w-6 h-6" />
                            <span className="text-[10px] font-medium mt-1">Home</span>
                        </button>
                        <button className="flex flex-col items-center justify-center w-full h-full text-text-quaternary hover:text-foreground dark:hover:text-foreground transition-colors">
                            <Users className="w-6 h-6" />
                            <span className="text-[10px] font-medium mt-1">Matches</span>
                        </button>
                        <div className="relative -top-5">
                            <Link href="/request/create">
                                <button className="w-12 h-12 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center transform transition-transform active:scale-95 border-2 border-background dark:border-card">
                                    <Plus className="w-6 h-6" />
                                </button>
                            </Link>
                        </div>
                        <button className="flex flex-col items-center justify-center w-full h-full text-text-quaternary hover:text-foreground dark:hover:text-foreground transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="text-[10px] font-medium mt-1">Alerts</span>
                        </button>
                        <button className="flex flex-col items-center justify-center w-full h-full text-text-quaternary hover:text-foreground dark:hover:text-foreground transition-colors">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-muted dark:bg-muted ring-1 ring-border-strong dark:ring-border">
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
        <div className="min-h-screen pt-20 flex flex-col items-center">
            <div className="w-full max-w-7xl px-4 lg:px-0 py-8 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Active Request Card with Embedded Scanning Block */}
                        <div className="relative overflow-hidden rounded-4xl glass-card">
                            {hasActiveMatch && <MatchBanner />}
                            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="p-6 sm:p-8 relative z-10">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                                            Αίτηση Αμοιβαίας
                                            <span className="px-2.5 py-1 rounded-2xl bg-muted border border-border text-muted-foreground font-mono tracking-wider">
                                                #TR-{request.id}
                                            </span>
                                        </h2>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-sm text-text-tertiary">Υποβλήθηκε στις <span className="text-text-secondary font-medium">{request.createdAt.toLocaleDateString("el-GR", { month: 'short', day: 'numeric', year: 'numeric' })}</span></span>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-primary-soft text-primary border border-primary/20 shadow-sm shadow-primary/5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2.5 animate-pulse"></span>
                                        Ενεργή
                                    </span>
                                </div>

                                {/* Scanning Block Embedded */}
                                <div className="scanning-pulse relative overflow-hidden rounded-4xl bg-gradient-to-br from-tech-card-start to-tech-card-end border border-tech-card-border shadow-xl shadow-primary/10 mb-8">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                                    <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-l from-primary/20 via-primary/10 to-transparent"></div>
                                    <div className="relative p-8 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                                        <div className="flex-shrink-0 relative">
                                            <div className="w-20 h-20 relative flex items-center justify-center">
                                                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-20 animate-ping" style={{ animationDuration: '3s' }}></span>
                                                <span className="absolute inline-flex h-[130%] w-[130%] rounded-full bg-primary opacity-10 animate-pulse"></span>
                                                <div className="relative w-16 h-16 rounded-full bg-card border border-primary/50 flex items-center justify-center shadow-soft">
                                                    <Radio className="w-8 h-8 text-primary animate-pulse" />
                                                    <div className="absolute inset-0 rounded-full border-t-2 border-primary/30 animate-spin" style={{ animationDuration: '4s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-grow w-full pt-1">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-lg font-semibold text-white tracking-wide">Σάρωση για Αμοιβαίες...</h3>
                                                <span className="text-[10px] font-mono text-primary-foreground bg-primary/40 px-2 py-1 rounded-2xl border border-primary/50 tracking-wider">REALTIME</span>
                                            </div>
                                            <p className="text-text-quaternary text-sm mb-5 leading-relaxed font-light">
                                                Ο αλγόριθμος αναζητά ευκαιρίες αμοιβαίας μετάθεσης στις Περιοχές Προτίμησής σας.
                                            </p>
                                            <div className="w-full bg-muted/30 rounded-full h-2 mb-4 overflow-hidden shadow-inner border border-border/20">
                                                <div className="bg-gradient-to-r from-primary via-primary/80 to-primary-bright h-full rounded-full w-3/4 animate-[shimmer_3s_infinite] relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-primary-foreground/20 skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] text-text-quaternary font-medium">
                                                <span>Φάση : Ανάλυση Περιοχών</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* "My Preferences" Block */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-foreground tracking-wide flex items-center gap-2">
                                            Οι Προτιμήσεις μου
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {request.targetZones.map((target, index) => (
                                            <div key={target.id} className="group flex items-center p-3 rounded-2xl bg-card border border-border-dim hover:border-primary/30 hover:bg-primary-soft transition-all shadow-ambient">
                                                <div className="w-8 h-8 rounded-2xl bg-muted border border-border-dim text-text-quaternary flex items-center justify-center text-xs font-bold mr-3 group-hover:border-primary/30 group-hover:text-primary group-hover:bg-primary-soft transition-colors">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="text-sm font-medium text-text-secondary truncate max-w-[100px]">{target.zone.name}</h4>
                                                        <PopularityBadge popularity={(target as any).popularity || 0} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 border-t border-border-dim pt-6">
                                    <Link href="/request/create" className="flex-1 sm:flex-none">
                                        <button className="w-full bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-soft active:scale-[0.98] cursor-pointer">
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
                        <div className="glass-card rounded-4xl h-fit overflow-hidden">
                            <div className="p-6 border-b border-border-dim flex justify-between items-center bg-card/50">
                                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Σύνοψη Προφίλ</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Designation */}
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-info-soft flex items-center justify-center text-info border border-info/20 group-hover:bg-info/20 transition-colors">
                                        <BadgeCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-text-quaternary uppercase tracking-wider mb-1">ΒΑΘΜΙΔΑ</p>
                                        <p className="text-sm font-medium text-text-secondary">{profile.division.name}</p>
                                    </div>
                                </div>
                                {/* Department */}
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-warning-soft flex items-center justify-center text-warning border border-warning/20 group-hover:bg-warning/20 transition-colors">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-text-quaternary uppercase tracking-wider mb-1">ΕΙΔΙΚΟΤΗΤΑ</p>
                                        <p className="text-sm font-medium text-text-secondary">{profile.specialty.name}</p>
                                    </div>
                                </div>
                                {/* Current Zone */}
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-success-soft flex items-center justify-center text-success border border-success/20 group-hover:bg-success/20 transition-colors">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-text-quaternary uppercase tracking-wider mb-1">ΤΡΕΧΟΥΣΑ ΘΕΣΗ</p>
                                        <p className="text-sm font-medium text-text-secondary">{profile.currentZone.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Target Zones */}
                        <div className="glass-card rounded-4xl flex flex-col overflow-hidden h-fit">
                            <div className="p-6 border-b border-border-dim bg-card/50">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">ΖΗΤΗΣΗ ΠΕΡΙΟΧΩΝ</h3>
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                {request.targetZones.map((target, index) => (
                                    <div key={target.id} className="group flex items-center p-3 rounded-2xl hover:bg-primary-soft border border-transparent hover:border-primary/20 transition-all">
                                        <div className="flex-shrink-0 mr-4">
                                            <div className="w-8 h-8 rounded-2xl bg-muted flex items-center justify-center text-xs font-bold text-text-quaternary group-hover:text-primary transition-colors border border-border-dim group-hover:border-primary/30 group-hover:bg-primary-soft">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="text-sm font-medium text-text-secondary truncate">{target.zone.name}</h4>
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
