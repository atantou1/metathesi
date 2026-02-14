import { getMatches } from "@/actions/matches"
import { MatchCard } from "@/components/matches/match-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, History, Zap } from "lucide-react"

export default async function MatchesPage() {
    const { active, history } = await getMatches()

    return (
        <div className="container max-w-4xl mx-auto py-8 pt-24 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Ταιριάσματα</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Δείτε τα ενεργά ταιριάσματα και το ιστορικό των αμοιβαίων μεταθέσεων.
                </p>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 h-auto p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl">
                    <TabsTrigger value="active" className="rounded-lg py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all">
                        <Zap className="w-4 h-4 mr-2" />
                        Ενεργά ({active.length})
                    </TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all">
                        <History className="w-4 h-4 mr-2" />
                        Ιστορικό ({history.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-6 focus:outline-none">
                    {active.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Κανένα ενεργό ταίριασμα</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">
                                Το σύστημα αναζητά συνεχώς νέες ευκαιρίες. Θα ειδοποιηθείτε μόλις βρεθεί κατάλληλος συνάδελφος.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {active.map(match => (
                                <MatchCard key={match.id} match={match} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="history" className="space-y-6 focus:outline-none">
                    {history.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-400">Δεν υπάρχει ιστορικό παλαιότερων ταιριασμάτων.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {history.map(match => (
                                <MatchCard key={match.id} match={match} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
