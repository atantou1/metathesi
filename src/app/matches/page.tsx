import { getMatches } from "@/actions/matches"
import { MatchCard } from "@/components/matches/match-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, MapPinPlus, Edit } from "lucide-react"
import Link from "next/link"

export default async function MatchesPage() {
    const { active, history } = await getMatches()

    return (
        <div className="max-w-md mx-auto md:max-w-4xl px-4 pt-24 pb-12">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Αμοιβαίες</h1>
                <p className="text-sm text-slate-500">Διαχειριστείτε τις ενεργές συνδέσεις και δείτε το ιστορικό.</p>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="flex w-full p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl mb-6 shadow-sm h-[60px]">
                    <TabsTrigger
                        value="active"
                        className="flex-1 h-full text-sm font-semibold rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-500 transition-all cursor-pointer"
                    >
                        Ενεργά
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="flex-1 h-full text-sm font-medium rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
                    >
                        Ιστορικό
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4 focus:outline-none">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Εμφανιση {active.length} Ενεργων
                        </span>
                    </div>

                    {active.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-4">
                            <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
                                <div className="absolute inset-0 border border-blue-600/10 rounded-full"></div>
                                <div className="absolute inset-8 border border-blue-600/20 rounded-full"></div>
                                <div className="absolute inset-16 border border-blue-600/30 rounded-full bg-blue-600/5"></div>
                                <div className="w-4 h-4 bg-blue-600 rounded-full relative z-10 shadow-lg shadow-blue-600/40">
                                    <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 w-[90px] h-[90px] bg-gradient-to-r from-transparent via-blue-600/10 to-blue-600/20 rounded-tr-full origin-bottom-left -translate-y-full transform rotate-45 pointer-events-none"></div>
                                <div className="absolute top-8 right-8 w-8 h-8 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center opacity-60">
                                    <User className="text-slate-400 w-3.5 h-3.5" />
                                </div>
                                <div className="absolute bottom-10 left-10 w-6 h-6 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center opacity-40">
                                    <User className="text-slate-400 w-2.5 h-2.5" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2 text-center">Καμία ενεργή σύνδεση</h2>
                            <p className="text-sm text-slate-500 text-center max-w-xs mb-8">
                                Δεν έχετε ακόμη κάποια αντιστοίχιση. Ο αλγόριθμός μας συνεχίζει να ψάχνει 24/7. Μόλις βρεθεί κάποιος συνάδελφος που ταιριάζει με τις προτιμήσεις σας, θα εμφανιστεί εδώ.
                            </p>
                            <div className="w-full max-w-sm">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">Tips για γρηγορότερο Match</h3>
                                <div className="grid gap-3 mb-8">
                                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 shadow-sm items-start">
                                        <div className="bg-green-50 text-green-600 rounded-lg p-2 shrink-0">
                                            <MapPinPlus className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900 mb-1">Περισσότερες επιλογές</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                Προσθέστε περισσότερες περιοχές επιθυμίας για να αυξήσετε τις πιθανότητες εύρεσης.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href="/request/create"
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm shadow-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Edit className="w-5 h-5" />
                                    Επεξεργασία Αιτήματος
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {active.map(match => (
                                <MatchCard key={match.id} match={match} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4 focus:outline-none">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Εμφανιση {history.length} Παλαιοτερων
                        </span>
                    </div>

                    {history.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                            <p className="text-slate-500">Δεν υπάρχει ιστορικό.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
