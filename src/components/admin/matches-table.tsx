"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export function MatchesTable({ matches }: { matches: any[] }) {
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
        router.push(`/admin/matches?${params.toString()}`);
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
                        variant={currentStatus === "active" ? "default" : "outline"}
                        onClick={() => updateFilter("status", "active")}
                        className="rounded-2xl"
                    >
                        Ενεργά
                    </Button>
                    <Button
                        variant={currentStatus === "inactive" ? "default" : "outline"}
                        onClick={() => updateFilter("status", "inactive")}
                        className="rounded-2xl"
                    >
                        Ανενεργά
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
                            <th className="px-6 py-4">Ειδικότητα / Βαθμίδα</th>
                            <th className="px-6 py-4">Συμμετέχων Α</th>
                            <th className="px-6 py-4">Συμμετέχων Β</th>
                            <th className="px-6 py-4">Ημ. Δημιουργίας</th>
                            <th className="px-6 py-4">Κατάσταση</th>
                            <th className="px-6 py-4">Ημ. Λήξης/Ολοκλήρωσης</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {matches.map((match) => {
                            const reqA = match.participants[0]?.request;
                            const reqB = match.participants[1]?.request;
                            const partA = reqA?.profile?.user;
                            const partB = reqB?.profile?.user;
                            
                            // Since specialty and division are common, use A's
                            const specialty = reqA?.profile?.specialty?.code;
                            const division = reqA?.profile?.division?.name;
                            
                            const isExpanded = expandedIds.includes(match.id);
                            
                            return (
                                <React.Fragment key={match.id}>
                                    <tr 
                                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => toggleExpand(match.id)}
                                    >
                                        <td className="px-6 py-4 font-medium text-foreground">#{match.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground">{specialty || "-"}</span>
                                                <span className="text-xs text-text-tertiary">{division || "-"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground">{partA?.fullName || "Άγνωστος"}</span>
                                                <span className="text-xs text-text-tertiary">{partA?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground">{partB?.fullName || "Άγνωστος"}</span>
                                                <span className="text-xs text-text-tertiary">{partB?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {new Date(match.createdAt).toLocaleDateString('el-GR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {match.status === "active" ? (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    Ενεργό
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                                                    Ανενεργό
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {match.completedAt ? new Date(match.completedAt).toLocaleDateString('el-GR') : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </Button>
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="bg-muted/10 border-b border-border">
                                            <td colSpan={8} className="px-6 py-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    {/* Participant A Details */}
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold text-foreground border-b border-border pb-2">
                                                            Στοιχεία Συμμετέχοντα Α: {partA?.fullName || "Άγνωστος"}
                                                        </h4>
                                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                                            <div className="text-text-tertiary">Οργανική:</div>
                                                            <div className="col-span-2 font-medium">{reqA?.profile?.currentZone?.name || "-"}</div>
                                                            
                                                            <div className="text-text-tertiary mt-2">Επιθυμίες:</div>
                                                            <div className="col-span-2 mt-2 space-y-1">
                                                                {reqA?.targetZones?.map((tz: any) => (
                                                                    <div key={tz.id} className="flex gap-2">
                                                                        <span className="text-text-tertiary">{tz.priorityOrder}.</span>
                                                                        <span>{tz.zone.name}</span>
                                                                    </div>
                                                                ))}
                                                                {(!reqA?.targetZones || reqA.targetZones.length === 0) && "-"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Participant B Details */}
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold text-foreground border-b border-border pb-2">
                                                            Στοιχεία Συμμετέχοντα Β: {partB?.fullName || "Άγνωστος"}
                                                        </h4>
                                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                                            <div className="text-text-tertiary">Οργανική:</div>
                                                            <div className="col-span-2 font-medium">{reqB?.profile?.currentZone?.name || "-"}</div>
                                                            
                                                            <div className="text-text-tertiary mt-2">Επιθυμίες:</div>
                                                            <div className="col-span-2 mt-2 space-y-1">
                                                                {reqB?.targetZones?.map((tz: any) => (
                                                                    <div key={tz.id} className="flex gap-2">
                                                                        <span className="text-text-tertiary">{tz.priorityOrder}.</span>
                                                                        <span>{tz.zone.name}</span>
                                                                    </div>
                                                                ))}
                                                                {(!reqB?.targetZones || reqB.targetZones.length === 0) && "-"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        {matches.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-text-tertiary">
                                    Δεν βρέθηκαν matches.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
