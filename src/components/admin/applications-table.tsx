"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ApplicationsTable({ applications }: { applications: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [expandedIds, setExpandedIds] = useState<number[]>([]);
    
    const currentStatus = searchParams.get("status") || "all";
    const currentSort = searchParams.get("sort") || "desc";

    const toggleExpand = (id: number) => {
        setExpandedIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`/admin/applications?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex gap-2">
                    <Button
                        variant={currentStatus === "all" ? "default" : "outline"}
                        onClick={() => updateFilter("status", "all")}
                        className="rounded-2xl"
                    >
                        Όλα
                    </Button>
                    <Button
                        variant={currentStatus === "active" || currentStatus === "matched" ? "default" : "outline"}
                        onClick={() => updateFilter("status", "active")}
                        className="rounded-2xl"
                    >
                        Ενεργά
                    </Button>
                    <Button
                        variant={currentStatus === "matched" ? "default" : "outline"}
                        onClick={() => updateFilter("status", "matched")}
                        className="rounded-2xl"
                    >
                        Matched
                    </Button>
                </div>

                <div className="flex gap-2 items-center">
                    <span className="text-sm text-text-tertiary">Ταξινόμηση:</span>
                    <Button
                        variant={currentSort === "desc" ? "default" : "outline"}
                        onClick={() => updateFilter("sort", "desc")}
                        className="rounded-2xl"
                    >
                        Νεότερα
                    </Button>
                    <Button
                        variant={currentSort === "asc" ? "default" : "outline"}
                        onClick={() => updateFilter("sort", "asc")}
                        className="rounded-2xl"
                    >
                        Παλαιότερα
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase text-text-tertiary bg-muted/50 border-b border-border">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Χρήστης</th>
                            <th className="px-6 py-4">Ειδικότητα / Βαθμίδα</th>
                            <th className="px-6 py-4">Τρέχουσα Ζώνη</th>
                            <th className="px-6 py-4">Κατάσταση</th>
                            <th className="px-6 py-4">Ημ. Δημιουργίας</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {applications.map((app) => {
                            const user = app.profile?.user;
                            const specialty = app.profile?.specialty?.code;
                            const division = app.profile?.division?.name;
                            const currentZone = app.profile?.currentZone?.name;
                            
                            const isExpanded = expandedIds.includes(app.id);
                            
                            return (
                                <React.Fragment key={app.id}>
                                    <tr 
                                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => toggleExpand(app.id)}
                                    >
                                        <td className="px-6 py-4 font-medium text-foreground">#{app.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground">{user?.fullName || "Άγνωστος"}</span>
                                                <span className="text-xs text-text-tertiary">{user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground">{specialty || "-"}</span>
                                                <span className="text-xs text-text-tertiary">{division || "-"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-foreground">
                                            {currentZone || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {app.matchParticipations && app.matchParticipations.some((mp: any) => mp.match.status === "active") ? (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                    Matched
                                                </span>
                                            ) : app.status === "active" ? (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    Ενεργή
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                                                    {app.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {new Date(app.createdAt).toLocaleDateString('el-GR')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </Button>
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="bg-muted/10 border-b border-border">
                                            <td colSpan={7} className="px-6 py-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="font-semibold text-foreground border-b border-border pb-2">
                                                            Προτιμήσεις (Ζώνες)
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {app.targetZones?.map((tz: any) => (
                                                                <div key={tz.id} className="flex gap-1.5 items-center bg-muted/50 px-2.5 py-1 rounded-lg border border-border">
                                                                    <span className="text-xs font-bold text-primary">
                                                                        {tz.priorityOrder}.
                                                                    </span>
                                                                    <span className="text-sm font-medium">{tz.zone.name}</span>
                                                                </div>
                                                            ))}
                                                            {(!app.targetZones || app.targetZones.length === 0) && (
                                                                <div className="text-text-tertiary text-sm">Δεν έχουν επιλεγεί ζώνες προτίμησης.</div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Matched Users Section */}
                                                    {app.matchParticipations && app.matchParticipations.length > 0 && (
                                                        <div>
                                                            <h4 className="font-semibold text-foreground border-b border-border pb-2">
                                                                Συμμετέχοντες σε Match
                                                            </h4>
                                                            <div className="space-y-2 mt-2">
                                                                {app.matchParticipations.map((mp: any) => {
                                                                    const match = mp.match;
                                                                    const otherParticipant = match.participants.find((p: any) => p.requestId !== app.id);
                                                                    if (!otherParticipant) return null;
                                                                    
                                                                    const otherUser = otherParticipant.request.profile.user;
                                                                    
                                                                    return (
                                                                        <div key={match.id} className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-border">
                                                                            <div className="flex flex-col">
                                                                                <span className="font-semibold text-foreground">{otherUser.fullName || "Άγνωστος"}</span>
                                                                                <span className="text-xs text-text-tertiary">{otherUser.email}</span>
                                                                            </div>
                                                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                                                Match #{match.id}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        {applications.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-text-tertiary">
                                    Δεν βρέθηκαν αιτήσεις.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
