import { getAdminDashboardStats } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Activity } from "lucide-react";

export default async function AdminDashboardPage() {
    const stats = await getAdminDashboardStats();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Η επισκόπηση και καταγραφή των σημαντικότερων λειτουργιών της εφαρμογής.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="rounded-[1.5rem] border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Συνολικοί Χρήστες</CardTitle>
                        <Users className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800">{stats.totalUsers}</div>
                        <p className="text-xs text-slate-500 mt-1">Εγγεγραμμένα μέλη</p>
                    </CardContent>
                </Card>
                <Card className="rounded-[1.5rem] border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Ενεργές Αιτήσεις</CardTitle>
                        <FileText className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#0369A1]">{stats.activeRequests}</div>
                        <p className="text-xs text-slate-500 mt-1">Σε αναμονή αμοιβαίας</p>
                    </CardContent>
                </Card>
                <Card className="rounded-[1.5rem] border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Συνολικά Matches</CardTitle>
                        <Activity className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-600">{stats.totalMatches}</div>
                        <p className="text-xs text-slate-500 mt-1">Επιτυχημένες ευρέσεις</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
