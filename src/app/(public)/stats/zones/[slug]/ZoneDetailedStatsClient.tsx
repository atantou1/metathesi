"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Info,
  Activity,
} from "lucide-react";
import { FilterSelect } from "@/components/stats/FilterSelect";
import { MigrationFlows } from "@/components/stats/MigrationFlows";

// --- Design System Colors ---
const theme = {
  bars: {
    past: "var(--border-strong)",
    current: "var(--primary)",
  },
  labels: {
    past: "var(--text-tertiary)",
    current: "var(--primary-hover)",
  },
};

// --- Helper Functions ---
const removeGreekAccents = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

interface DetailedStatsClientProps {
  zoneName: string;
  specialtyCode: string;
  specialtyName?: string;
  division: string;
  stats: any;
  successHistory: Record<string, number | null>;
  baseHistory: Record<string, number | null>;
  targetingHistory: Record<string, number | null>;
  leavingHistory: Record<string, number | null>;
  avgHistory: Record<string, number | null>;
  avgAppHistory: Record<string, number | null>;
  satisfactionRate: number;
  satisfactionTrend: number;
  inflow: any[];
  outflow: any[];
}

export default function ZoneDetailedStatsClient({
  zoneName,
  specialtyCode,
  specialtyName,
  division,
  stats,
  successHistory,
  baseHistory,
  targetingHistory,
  leavingHistory,
  avgHistory,
  avgAppHistory,
  inflow,
  outflow,
}: DetailedStatsClientProps) {
  const router = useRouter();

  // Filter Data State
  const [allSpecialties, setAllSpecialties] = useState<any[]>([]);
  const [allDivisions, setAllDivisions] = useState<any[]>([]);
  const [allZones, setAllZones] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/stats/filters")
      .then((r) => r.json())
      .then((data) => {
        setAllSpecialties(data.specialties || []);
        setAllDivisions(data.divisions || []);
        setAllZones(data.postingZones || []);
      })
      .catch(console.error);
  }, []);

  // Filter Handlers
  const handleRegionChange = (newRegion: string) => {
    router.push(`/stats/zones/${encodeURIComponent(newRegion)}?division=${encodeURIComponent(division)}&specialty=${encodeURIComponent(specialtyCode)}`);
  };

  const handleDivisionChange = (newDivision: string) => {
    router.push(`/stats/zones/${encodeURIComponent(zoneName)}?division=${encodeURIComponent(newDivision)}&specialty=${encodeURIComponent(specialtyCode)}`);
  };

  const handleSpecialtyChange = (newSpecialty: string) => {
    router.push(`/stats/zones/${encodeURIComponent(zoneName)}?division=${encodeURIComponent(division)}&specialty=${encodeURIComponent(newSpecialty)}`);
  };

  // Options transformed for FilterSelect
  const uniqueDivisionNames = Array.from(new Set(allDivisions.map((d) => d.name)));
  const divisionOptions = uniqueDivisionNames.map((name) => ({ value: name, label: name }));
  
  const zoneOptions = Array.from(new Set(allZones)).map((z) => ({ value: z, label: z }));
  
  const specialtyOptions = allSpecialties
    .filter(s => {
      const isPrimary = division.includes("Πρωτοβάθμια");
      const isSecondary = division.includes("Δευτεροβάθμια");
      if (isPrimary) return s.isPrimary;
      if (isSecondary) return s.isSecondary;
      return true;
    })
    .map((s) => ({ value: s.code, label: s.code })); // User requested only code

  // Difficulty Mapping
  const diffMap: Record<string, { label: string; color: string }> = {
    Extreme:   { label: 'Υψηλός Ανταγωνισμός', color: 'text-danger bg-danger-soft border-danger/20' },
    High:      { label: 'Αυξημένος Ανταγωνισμός',  color: 'text-warning bg-warning-soft border-warning/20' },
    Moderate:  { label: 'Υπολογίσιμος Ανταγωνισμός', color: 'text-info bg-info-soft border-info/20' },
    Accessible: { label: 'Ήπιος Ανταγωνισμός', color: 'text-success bg-success-soft border-success/20' },
    Unknown:   { label: 'Χωρίς Δεδομένα', color: 'text-text-tertiary bg-surface-dim border-border' },
  }
  const diff = diffMap[stats.difficultyCategory] || diffMap.Unknown;

  // Transform history to Recharts format
  const transformHistory = (history: Record<string, number | null>) => {
    if (!history) return [];
    return Object.entries(history)
      .filter(([_, val]) => val !== null && val !== undefined)
      .map(([year, val]) => ({ year, val: val || 0 }))
      .sort((a, b) => a.year.localeCompare(b.year));
  };

  // Helper to dynamically calculate diff from history
  const getDiff = (history: Record<string, number | null> | undefined) => {
    if (!history) return null;
    const years = Object.keys(history)
      .filter(y => history[y] !== null && history[y] !== undefined)
      .sort((a, b) => b.localeCompare(a)); // sort descending
    
    if (years.length >= 2) {
      const current = history[years[0]] || 0;
      const previous = history[years[1]] || 0;
      return current - previous;
    }
    return null;
  };

  const kpis = [
    {
      id: "success",
      title: "Μεταθέσεις (Πραγμ.)",
      value: stats.successCount,
      diff: getDiff(successHistory),
      isPercent: false,
      isPrimary: true,
      data: transformHistory(successHistory),
      infoWhat: "Ο ακριβής αριθμός των εκπαιδευτικών που πήραν μετάθεση στη συγκεκριμένη περιοχή.",
      infoWhy: "Δείχνει την πραγματική απορροφητικότητα της περιοχής για την ειδικότητά σας."
    },
    {
        id: "base",
        title: "Βάση Μορίων",
        value: stats.baseScore?.toFixed(2) || "0",
        diff: getDiff(baseHistory),
        isPercent: false,
        inverted: true,
        data: transformHistory(baseHistory),
        infoWhat: "Τα χαμηλότερα μόρια με τα οποία πήρε κάποιος μετάθεση στην περιοχή αυτή.",
        infoWhy: "Αποτελεί το ελάχιστο όριο που πρέπει να ξεπεράσετε για να έχετε ελπίδες μετάθεσης."
    },
    {
        id: "demand",
        title: "Ζήτηση (1η Προτ.)",
        value: stats.targeting1stCount,
        diff: getDiff(targetingHistory),
        isPercent: false,
        inverted: true,
        data: transformHistory(targetingHistory),
        infoWhat: "Πόσοι εκπαιδευτικοί δήλωσαν την περιοχή αυτή ως 1η τους επιλογή.",
        infoWhy: "Δείχνει πόσοι 'ανταγωνίζονται' άμεσα μαζί σας για τις ίδιες θέσεις."
    },
    {
        id: "leaving",
        title: "Αιτήσεις Αποχώρησης",
        value: stats.leavingCount,
        diff: getDiff(leavingHistory),
        isPercent: false,
        data: transformHistory(leavingHistory),
        infoWhat: "Πόσοι εκπαιδευτικοί που βρίσκονται ήδη στην περιοχή ζήτησαν να φύγουν.",
        infoWhy: "Περισσότερες αποχωρήσεις σημαίνουν συνήθως περισσότερα κενά για εσάς."
    },
    {
        id: "avg_succ",
        title: "Μ.Ο. Επιτυχόντων",
        value: stats.avgScore?.toFixed(2) || "0",
        diff: getDiff(avgHistory),
        isPercent: false,
        data: transformHistory(avgHistory),
        infoWhat: "Ο μέσος όρος των μορίων όσων ήρθαν με μετάθεση στην περιοχή.",
        infoWhy: "Δίνει μια πιο σταθερή εικόνα του ανταγωνισμού από ό,τι η βάση."
    },
    {
        id: "avg_app",
        title: "Μ.Ο. Αιτούντων",
        value: stats.avgScoreApplicants?.toFixed(2) || "0",
        diff: getDiff(avgAppHistory),
        isPercent: false,
        data: transformHistory(avgAppHistory),
        infoWhat: "Ο μέσος όρος των μορίων όλων όσων ζήτησαν την περιοχή αυτή.",
        infoWhy: "Αποκαλύπτει το επίπεδο των μορίων της 'μάζας' που διεκδικεί την περιοχή."
    }
  ];

  const getValidYears = (...histories: (Record<string, number | null> | undefined)[]) => {
    const years = new Set<string>();
    histories.forEach(history => {
      if (!history) return;
      Object.entries(history).forEach(([year, val]) => {
        if (val !== null && val !== undefined) years.add(year);
      });
    });
    return Array.from(years).sort();
  };

  const comparisonYears = getValidYears(baseHistory, avgAppHistory);
  const comparisonData = comparisonYears.map(year => ({
    year,
    base: baseHistory[year] || 0,
    avgApp: avgAppHistory[year] || 0
  }));

  const balanceYears = getValidYears(targetingHistory, successHistory);
  const balanceData = balanceYears.map(year => ({
    year,
    demand: targetingHistory[year] || 0,
    success: successHistory[year] || 0
  }));

  return (
    <div className="p-4 md:p-8 text-foreground antialiased min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 pt-20 md:pt-24">
        
        {/* --- Premium Header --- */}
        <div className="flex flex-col md:flex-row md:items-start justify-between bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <Link
                href={`/stats?division=${encodeURIComponent(division)}&specialty=${encodeURIComponent(specialtyCode)}`}
                className="text-muted-foreground hover:text-primary hover:bg-primary-soft transition-colors flex items-center text-xs font-bold px-3 py-1.5 rounded-2xl border border-transparent hover:border-primary/20 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Επιστροφή στον Χάρτη
              </Link>
              
              <FilterSelect 
                value={specialtyCode}
                onChange={handleSpecialtyChange}
                options={specialtyOptions}
                fontSize="11px"
                fontWeight="700"
                padding="6px 14px"
                background="var(--card)"
              />

              <FilterSelect 
                value={division}
                onChange={handleDivisionChange}
                options={divisionOptions}
                fontSize="11px"
                fontWeight="700"
                padding="6px 14px"
                background="var(--card)"
                className="!text-primary-hover"
              />
            </div>
            
            <div className="flex items-center gap-4">
               <FilterSelect 
                 value={zoneName}
                 onChange={handleRegionChange}
                 options={zoneOptions}
                 fontSize="1.875rem" // 3xl
                 fontWeight="800"
                 padding="0"
                 background="transparent"
                 className="!border-none !shadow-none !p-0 -ml-1 hover:bg-surface-dim/50 rounded-xl px-1"
               />
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end">
            <div className={`px-4 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest border shadow-sm flex items-center ${diff.color}`}>
              {diff.label}
            </div>
          </div>
        </div>

        {/* --- KPI Grid (6 cards) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {kpis.map((kpi) => {
            const isPositive = (kpi.diff || 0) > 0;
            const isGood = kpi.inverted ? !isPositive : isPositive;
            const DiffIcon = kpi.diff === 0 ? Activity : isPositive ? TrendingUp : TrendingDown;
            const badgeClasses = kpi.diff === 0 
              ? "text-text-tertiary bg-muted border border-border" 
              : isGood 
                ? "text-success bg-success-soft border border-success/20" 
                : "text-danger bg-danger-soft border border-danger/20";

            return (
                  <div
                key={kpi.id}
                className="bg-card p-5 rounded-4xl border border-border shadow-soft hover:shadow-floating hover:border-primary/30 transition-all flex flex-col justify-between h-56 group"
              >
                <div>
                  <div className="flex justify-between items-start mb-1 h-8">
                    <div className="flex items-center gap-1.5 relative group/tooltip">
                      <div className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest leading-tight">
                        {removeGreekAccents(kpi.title).toUpperCase()}
                      </div>
                      <Info className="w-3.5 h-3.5 text-text-quaternary hover:text-text-tertiary cursor-help transition-colors" />
                      <div className="absolute left-0 top-6 hidden group-hover/tooltip:block w-64 bg-card border border-border text-left p-4 rounded-xl shadow-xl z-50 pointer-events-none">
                        <div className="mb-3">
                          <span className="text-[10px] font-extrabold text-info uppercase tracking-widest block mb-1">ΤΙ ΕΙΝΑΙ</span>
                          <span className="text-xs text-text-secondary leading-snug">{kpi.infoWhat}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold text-text-quaternary uppercase tracking-widest block mb-1">ΓΙΑΤΙ ΕΙΝΑΙ ΣΗΜΑΝΤΙΚΟ</span>
                          <span className="text-xs text-text-secondary leading-snug">{kpi.infoWhy}</span>
                        </div>
                        <div className="absolute -top-1 left-4 w-2.5 h-2.5 bg-card border-l border-t border-border transform rotate-45"></div>
                      </div>
                    </div>

                    {kpi.diff !== null && (
                      <div className={`text-[10px] whitespace-nowrap font-bold px-2 py-0.5 rounded-2xl flex items-center h-fit ${badgeClasses}`}>
                        {isPositive ? "+" : ""}
                        {typeof kpi.diff === 'number' ? kpi.diff.toFixed(kpi.id.includes('avg') || kpi.id === 'base' ? 1 : 0) : kpi.diff}
                        {kpi.isPercent ? "%" : ""}{" "}
                        <DiffIcon className="w-3 h-3 ml-0.5" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                  <div className="text-3xl mt-1 font-extrabold tracking-tight text-foreground">{kpi.value}</div>
                </div>

                <div className="h-20 w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={kpi.data} margin={{ top: 15, right: 0, bottom: 0, left: 0 }}>
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--text-tertiary)", fontWeight: 500 }} dy={5} />
                      <RechartsTooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ display: "none" }} />
                      <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                        <LabelList
                          dataKey="val"
                          position="top"
                          content={(props: any) => {
                            const { x, y, value, index } = props;
                            const isLast = index === kpi.data.length - 1;
                            return (
                              <text x={x + props.width / 2} y={y - 5} fill={isLast ? theme.labels.current : theme.labels.past} fontSize={10} fontWeight={600} textAnchor="middle">
                                {value}
                              </text>
                            );
                          }}
                        />
                        {kpi.data.map((entry, index) => {
                          const isLast = index === kpi.data.length - 1;
                          return <Cell key={`cell-${index}`} fill={isLast ? theme.bars.current : theme.bars.past} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- Main Charts --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl flex flex-col h-[400px]">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">Σύγκριση Μορίων & Βάσεων</h3>
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">ΠΩΣ ΚΙΝΗΘΗΚΕ Η ΒΑΣΗ ΣΕ ΣΧΕΣΗ ΜΕ ΤΟΥΣ ΑΙΤΟΥΝΤΕΣ</p>
                    </div>
                </div>
                <div className="flex-1 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-dim)" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-tertiary)", fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--text-quaternary)" }} />
                      <RechartsTooltip 
                        cursor={{ fill: "var(--muted)" }}
                        contentStyle={{ 
                          borderRadius: "16px", 
                          border: "1px solid var(--border)", 
                          backgroundColor: "var(--card)", 
                          color: "var(--foreground)", 
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" 
                        }} 
                        itemStyle={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}
                        labelStyle={{ color: "var(--text-tertiary)", fontWeight: 700, marginBottom: "4px" }}
                      />
                      <Bar dataKey="base" name="Βάση" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="avgApp" name="Μ.Ο. Αιτούντων" fill="var(--border-strong)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl flex flex-col h-[400px]">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">Ισοζύγιο Προσφοράς & Ζήτησης</h3>
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">ΣΥΓΚΡΙΣΗ ΑΙΤΗΣΕΩΝ ΜΕ ΠΡΑΓΜΑΤΙΚΕΣ ΘΕΣΕΙΣ</p>
                    </div>
                </div>
                <div className="flex-1 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={balanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-dim)" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-tertiary)", fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--text-quaternary)" }} />
                      <RechartsTooltip 
                        cursor={{ fill: "var(--muted)" }}
                        contentStyle={{ 
                          borderRadius: "16px", 
                          border: "1px solid var(--border)", 
                          backgroundColor: "var(--card)", 
                          color: "var(--foreground)", 
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" 
                        }} 
                        itemStyle={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}
                        labelStyle={{ color: "var(--text-tertiary)", fontWeight: 700, marginBottom: "4px" }}
                      />
                      <Bar dataKey="demand" name="Ζήτηση" fill="var(--border-strong)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="success" name="Μεταθέσεις" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* --- Migration Flows --- */}
        <MigrationFlows inflow={inflow} outflow={outflow} />

      </div>
    </div>
  );
}
