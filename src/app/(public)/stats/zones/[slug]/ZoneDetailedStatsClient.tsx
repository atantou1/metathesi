"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
} from "lucide-react";
import { FilterSelect } from "@/components/stats/FilterSelect";
import { motion } from "framer-motion";

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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < 768);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function InfoTooltip({ 
  title, 
  description, 
  iconClassName = "w-5 h-5",
}: { 
  title: string, 
  description: string, 
  iconClassName?: string,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div 
      className="group/tooltip inline-flex items-center justify-center cursor-pointer"
      ref={tooltipRef}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      <Info className={`${iconClassName} text-text-quaternary hover:text-text-tertiary transition-colors`} />
      
      <div className={`absolute top-12 left-4 right-4 w-auto sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-72 ${isOpen ? "block" : "hidden sm:group-hover/tooltip:block"} bg-card border border-border text-left p-4 rounded-xl shadow-xl z-[60] font-sans`}>
        <div className="mb-3">
          <span className="text-[10px] font-extrabold text-info uppercase tracking-widest block mb-1">ΤΙ ΕΙΝΑΙ</span>
          <span className="text-xs text-text-secondary leading-snug font-normal">{title}</span>
        </div>
        <div>
          <span className="text-[10px] font-extrabold text-text-quaternary uppercase tracking-widest block mb-1">ΓΙΑΤΙ ΕΙΝΑΙ ΣΗΜΑΝΤΙΚΟ</span>
          <span className="text-xs text-text-secondary leading-snug font-normal">{description}</span>
        </div>
        <div className={`hidden sm:block absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-card border-l border-t border-border transform rotate-45`}></div>
      </div>
    </div>
  );
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
  const isMobile = useIsMobile();

  // Filter Data State
  const [allSpecialties, setAllSpecialties] = useState<any[]>([]);
  const [allDivisions, setAllDivisions] = useState<any[]>([]);
  const [allZones, setAllZones] = useState<string[]>([]);

  // Show All State for Migration Flows
  const [showAllInflow, setShowAllInflow] = useState(false);
  const [showAllOutflow, setShowAllOutflow] = useState(false);

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

  const comparisonYears = getValidYears(baseHistory, avgAppHistory).filter(y => y !== "2022" && y !== "2023");
  const comparisonData = comparisonYears.map(year => ({
    year,
    base: baseHistory[year] || 0,
    avgApp: avgAppHistory[year] || 0
  }));

  const balanceYears = getValidYears(targetingHistory, successHistory).filter(y => y !== "2022" && y !== "2023");
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
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <div className="flex items-center gap-3">
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
              </div>

              <FilterSelect 
                value={division}
                onChange={handleDivisionChange}
                options={divisionOptions}
                fontSize="11px"
                fontWeight="700"
                padding="6px 14px"
                background="var(--card)"
                className="!text-primary-hover w-fit"
              />
            </div>
            
            <div className="flex items-center gap-4">
               <FilterSelect 
                 value={zoneName}
                 onChange={handleRegionChange}
                 options={zoneOptions}
                 fontSize="clamp(1.5rem, 6vw, 1.875rem)"
                 fontWeight="800"
                 padding="0"
                 background="transparent"
                 className="!border-none !shadow-none !p-0 -ml-1 hover:bg-surface-dim/50 rounded-xl px-1"
                 multiline={isMobile}
               />
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end">
            <div className={`px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest border shadow-sm flex items-center ${diff.color}`}>
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
                className="relative bg-card p-5 rounded-4xl border border-border shadow-soft hover:shadow-floating hover:border-primary/30 transition-all flex flex-col justify-between h-56 group"
              >
                <div>
                  <div className="flex justify-between items-start mb-1 h-8">
                    <div className="flex items-center gap-1.5 w-fit">
                      <div className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest leading-tight">
                        {removeGreekAccents(kpi.title).toUpperCase()}
                      </div>
                      <InfoTooltip 
                        title={kpi.infoWhat}
                        description={kpi.infoWhy}
                        iconClassName="w-3.5 h-3.5"
                      />
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
            <div className="relative bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl flex flex-col h-[400px]">
                <div className="flex flex-col xl:flex-row justify-between items-start mb-6 gap-4 xl:gap-0">
                    <div className="flex items-center gap-2 mb-1 z-50">
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Σύγκριση Μ.Ο. Αιτούντων & Βάσεων</h3>
                        <InfoTooltip 
                          title="Απεικονίζει τη διαχρονική εξέλιξη του Μέσου Όρου των Μορίων των Αιτούντων σε σχέση με τη Βάση (τα μόρια του τελευταίου μετατεθέντα)."
                          description="Δείχνει την τάση του ανταγωνισμού και τη δυσκολία της χρονιάς, βοηθώντας σας να κατανοήσετε αν οι βάσεις κινούνται ανοδικά ή καθοδικά."
                        />
                    </div>
                    <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-primary"></div> ΒΑΣΗ
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-muted"></div> ΑΙΤΟΥΝΤΕΣ
                        </div>
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

            <div className="relative bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl flex flex-col h-[400px]">
                <div className="flex flex-col xl:flex-row justify-between items-start mb-6 gap-4 xl:gap-0">
                    <div className="flex items-center gap-2 mb-1 z-50">
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Ισοζύγιο Προσφοράς & Ζήτησης</h3>
                        <InfoTooltip 
                          title="Σύγκριση του συνολικού αριθμού των αιτήσεων με τον αριθμό των εκπαιδευτικών που τελικά πήραν μετάθεση."
                          description="Δείχνει τον πραγματικό 'συνωστισμό' και την πιθανότητα επιτυχίας. Μεγάλη διαφορά υποδηλώνει υψηλό ανταγωνισμό για λίγες θέσεις."
                        />
                    </div>
                    <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-primary"></div> ΜΕΤΑΘΕΣΕΙΣ
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-muted"></div> ΖΗΤΗΣΗ
                        </div>
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

        {/* --- Migration Flows (Split into 2 cards) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: Inflow */}
          <div className="relative bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl flex flex-col justify-start items-start text-left">
            <div className="flex items-center gap-2 w-fit mb-4 z-50">
              <h3 className="text-xl font-bold text-foreground">
                Ροές Εισόδου
              </h3>
              <InfoTooltip 
                title="Η προέλευση των εκπαιδευτικών που κατάφεραν να πάρουν μετάθεση προς τη συγκεκριμένη περιοχή."
                description="Χρήσιμο για να εντοπίσετε από ποιες περιοχές 'αδειάζουν' θέσεις και ποιες περιοχές τροφοδοτούν τη συγκεκριμένη ζώνη."
              />
            </div>
            <div className="w-full space-y-6">
              {(showAllInflow ? inflow : inflow.slice(0, 5)).map((item, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-text-secondary group-hover:text-primary transition-colors">
                      {item.name}
                    </span>
                    <span className="text-[11px] bg-muted border border-border px-2 py-0.5 rounded-2xl shadow-sm">
                      <span className="font-extrabold text-foreground">{item.count}</span>
                      <span className="text-text-tertiary ml-1">μεταθέσεις</span>
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-inner">
                    <motion.div
                      className="bg-gradient-to-r from-primary/70 to-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.count / Math.max(...inflow.map(f => f.count), 1)) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
              {inflow.length === 0 && (
                <p className="text-sm text-text-quaternary italic">Δεν υπάρχουν διαθέσιμα δεδομένα εισροών.</p>
              )}
              {inflow.length > 5 && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setShowAllInflow(!showAllInflow)}
                    className="text-xs font-bold text-primary hover:text-primary-hover transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {showAllInflow ? "Σύμπτυξη" : `Περισσότερα (${inflow.length})`}
                    <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${showAllInflow ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Outflow */}
          <div className="relative bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl flex flex-col justify-start items-start text-left">
            <div className="flex items-center gap-2 w-fit mb-4 z-50">
              <h3 className="text-xl font-bold text-foreground">
                Ροές Εξόδου
              </h3>
              <InfoTooltip 
                title="Οι κορυφαίες προτιμήσεις των εκπαιδευτικών που υπηρετούν ήδη εδώ και ζητούν μετάθεση."
                description="Ιδανικό εργαλείο αν αναζητάτε αμοιβαία μετάθεση, καθώς σας δείχνει προς τα πού υπάρχει τάση φυγής."
              />
            </div>
            <div className="w-full space-y-6">
              {(showAllOutflow ? outflow : outflow.slice(0, 5)).map((item, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-text-secondary group-hover:text-primary transition-colors">
                      {item.name}
                    </span>
                    <span className="text-[11px] bg-muted border border-border px-2 py-0.5 rounded-2xl shadow-sm">
                      <span className="font-extrabold text-foreground">{item.count}</span>
                      <span className="text-text-tertiary ml-1">αιτήσεις</span>
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-inner">
                    <motion.div
                      className="bg-gradient-to-r from-primary/70 to-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.count / Math.max(...outflow.map(f => f.count), 1)) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
              {outflow.length === 0 && (
                <p className="text-sm text-text-quaternary italic">Δεν υπάρχουν διαθέσιμα δεδομένα εκροών.</p>
              )}
              {outflow.length > 5 && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setShowAllOutflow(!showAllOutflow)}
                    className="text-xs font-bold text-primary hover:text-primary-hover transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {showAllOutflow ? "Σύμπτυξη" : `Περισσότερα (${outflow.length})`}
                    <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${showAllOutflow ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
