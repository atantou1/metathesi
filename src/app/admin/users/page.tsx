import { getUsersList } from "@/actions/admin";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BanUserButton } from "./ban-user-button";

export default async function AdminUsersPage() {
    const users = await getUsersList();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Χρήστες</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Διαχείριση εγγεγραμμένων χρηστών και δικαιωμάτων.</p>
            </div>

            <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
                <CardHeader>
                    <CardTitle>Εγγεγραμμένοι Χρήστες (Τελευταίοι 50)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Ονομα</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-semibold">Ρολος</th>
                                    <th className="px-6 py-4 font-semibold">Κατασταση</th>
                                    <th className="px-6 py-4 font-semibold text-right">Ενεργειες</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{user.fullName || "N/A"}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-2xl text-xs font-bold">{user.role}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.status === "BANNED" ? (
                                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-2xl text-xs font-bold" title={user.banReason || ""}>BANNED</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-2xl text-xs font-bold">{user.status}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.status !== "BANNED" && user.role !== "SUPERADMIN" && (
                                                <BanUserButton userId={user.id} />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
