import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { el } from "date-fns/locale"
import { MatchResult } from "@/lib/matching"
import { User, MapPin, Calendar, Briefcase, ArrowRight } from "lucide-react"

export function MatchCard({ match }: { match: MatchResult }) {
    const isHistory = match.status !== 'active'

    return (
        <Card className={`overflow-hidden transition-all hover:shadow-md ${isHistory ? 'opacity-80' : 'border-blue-200 shadow-sm'}`}>
            <CardHeader className={`pb-3 ${isHistory ? 'bg-slate-50' : 'bg-blue-50/50'}`}>
                <div className="flex justify-between items-start">
                    <div className="flex gap-2 items-center">
                        <Badge variant={isHistory ? "secondary" : "default"} className={isHistory ? "" : "bg-blue-600 hover:bg-blue-700"}>
                            {isHistory ? "Ολοκληρωμένο" : "Ενεργό Ταίριασμα"}
                        </Badge>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(match.matchDate), "d MMM yyyy", { locale: el })}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4 grid gap-4 md:grid-cols-2">
                {/* Other Party Info */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Συναδελφος
                    </h4>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="font-medium text-slate-900">{match.user.fullName}</div>
                        <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            <Briefcase className="w-3 h-3" />
                            {match.user.specialty.name}
                        </div>
                        <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            {match.user.currentZone.name}
                        </div>
                    </div>
                </div>

                {/* Match Details / Target */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        Ζητούμενη Περιοχή
                    </h4>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        {/* Usually a match means they want where YOU are, or a circular swap. 
                            For simplicity, let's show what THEY want (which should match what YOU have if direct).
                            Or just show the zones involved.
                        */}
                        <div className="flex flex-wrap gap-2">
                            {match.targetZones.map(z => (
                                <Badge key={z.id} variant="outline" className="bg-white text-green-700 border-green-200">
                                    {z.name}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-xs text-green-600/80 mt-2">
                            Ο συνάδελφος επιθυμεί αμοιβαία μετάθεση στην περιοχή σας.
                        </p>
                    </div>
                </div>

                {/* Contact Info (if active) */}
                {!isHistory && (
                    <div className="md:col-span-2 pt-2 border-t border-slate-100 mt-2">
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <span className="text-slate-500">Email επικοινωνίας: </span>
                                <a href={`mailto:${match.user.email}`} className="font-medium text-blue-600 hover:underline">
                                    {match.user.email}
                                </a>
                            </div>
                            {/* Actions could go here (Accept/Reject) */}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
