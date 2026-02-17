import { MatchResult } from "@/lib/matching"
import { format } from "date-fns"
import { el } from "date-fns/locale"
import {
    User,
    MapPin,
    Calendar,
    MoreVertical,
    MessageCircle,
    Star,
    ArrowRight,
    AlertCircle
} from "lucide-react"

export function MatchCard({ match }: { match: MatchResult }) {
    const isActive = match.status === 'active'

    // Determine styles based on rank
    const getRankStyles = (rank: number) => {
        if (rank === 1) {
            return {
                bg: "bg-blue-50 border-blue-100",
                text: "text-blue-600",
                label: "text-blue-600",
                icon: <Star className="w-3.5 h-3.5" />,
                labelIcon: "text-blue-600"
            }
        }
        if (rank <= 3) {
            return {
                bg: "bg-slate-50 border-slate-200",
                text: "text-slate-700",
                label: "text-slate-500",
                icon: <ArrowRight className="w-3.5 h-3.5" />,
                labelIcon: "text-slate-400"
            }
        }
        return {
            bg: "bg-slate-50 border-slate-200",
            text: "text-slate-700",
            label: "text-slate-500",
            icon: <ArrowRight className="w-3.5 h-3.5" />,
            labelIcon: "text-slate-400"
        }
    }

    const rankStyle = getRankStyles(match.rank)

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <div className="p-4 flex items-start justify-between border-b border-slate-100/50">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <User className="w-6 h-6" />
                        </div>
                        {isActive && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                        {!isActive && match.completedAt && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-400 border-2 border-white rounded-full"></span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">{match.user.fullName}</h3>
                        <p className="text-xs text-slate-500">{match.user.specialty.name}</p>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-blue-600">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    {/* Location / Organic */}
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Οργανική</p>
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            <span className="truncate">{match.user.currentZone.name}</span>
                        </div>
                    </div>

                    {/* Rank */}
                    <div className={`${rankStyle.bg} border p-2.5 rounded-lg`}>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${rankStyle.label}`}>Επιλογή</p>
                        <div className={`flex items-center gap-1 font-bold ${rankStyle.text}`}>
                            {rankStyle.icon}
                            {match.rank}η Επιλογή - {match.id}
                        </div>
                    </div>
                </div>

                <div className="pt-2 border-t border-dashed border-slate-200">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Ταιριασμα: {format(new Date(match.matchDate), "d MMM yyyy", { locale: el })}
                    </p>
                    {!isActive && match.completedAt && (
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Έληξε: {format(new Date(match.completedAt), "d MMM yyyy", { locale: el })}
                        </p>
                    )}
                </div>
            </div>

            <div className="p-4 pt-0">
                <a
                    href={`mailto:${match.user.email}`}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-600/30"
                >
                    <MessageCircle className="w-4 h-4" />
                    Επικοινωνία
                </a>
            </div>
        </div>
    )
}
