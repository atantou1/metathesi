import { getAdminDashboardStats } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Activity } from "lucide-react";

export default async function AdminDashboardPage() {
    const stats = await getAdminDashboardStats();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground dark:text-white">Dashboard</h2>
                <p className="text-muted-foreground dark:text-text-quaternary mt-2">Η επισκόπηση και καταγραφή των σημαντικότερων λειτουργιών της εφαρμογής.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="rounded-2xl border-border shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-text-tertiary">Συνολικοί Χρήστες</CardTitle>
                        <Users className="h-5 w-5 text-text-quaternary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.totalUsers}</div>
                        <p className="text-xs text-text-tertiary mt-1">Εγγεγραμμένα μέλη</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-border shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-text-tertiary">Ενεργές Αιτήσεις</CardTitle>
                        <FileText className="h-5 w-5 text-text-quaternary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">{stats.activeRequests}</div>
                        <p className="text-xs text-text-tertiary mt-1">Σε αναμονή αμοιβαίας</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-border shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-text-tertiary">Συνολικά Matches</CardTitle>
                        <Activity className="h-5 w-5 text-text-quaternary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-600">{stats.totalMatches}</div>
                        <p className="text-xs text-muted-foreground mt-1">Επιτυχημένες ευρέσεις</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
