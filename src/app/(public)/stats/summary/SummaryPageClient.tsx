"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
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
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
} from "recharts";

const PIE_COLORS = [
  "hsl(217, 91%, 60%)", 
  "hsl(142, 71%, 45%)", 
  "hsl(35, 92%, 53%)",  
  "hsl(262, 83%, 58%)", 
  "hsl(199, 89%, 48%)"  
];
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Map,
  Info,
  Activity,
  ChevronDown,
  Search,
} from "lucide-react";
import { FilterSelect } from "@/components/stats/FilterSelect";

// Types derived from /api/stats/filters logic
interface Specialty {
  code: string;
  name: string;
  isPrimary: boolean;
  isSecondary: boolean;
}

interface Division {
  name: string;
}

interface AnalyticsData {
  successCount: number;
  successCountHistory: Record<string, number>;
  successCountDiff: number;
  baseScore: number;
  baseScoreHistory: Record<string, number>;
  baseScoreDiff: number;
  avgScore: number;
  avgScoreHistory: Record<string, number>;
  avgScoreDiff: number;
  top5DestinationRegions: Record<string, number>;
  top5CompetitiveRegions: Record<string, number>;
  nationalPointsRange: number;
  nationalPointsRangeHistory: Record<string, number>;
  nationalPointsRangeDiff: number;
  specialCategoryRate: number;
  specialCategoryRateHistory: Record<string, number>;
  specialCategoryRateDiff: number;
  activeRegionsRate: number;
  activeRegionsRateHistory: Record<string, number>;
  activeRegionsRateDiff: number;
  leavingCount: number;
  leavingCountHistory: Record<string, number>;
  leavingCountDiff: number;
  top5Targeting1st: Record<string, number>;
  avgScoreApplicants: number;
  avgScoreApplicantsHistory: Record<string, number>;
  avgScoreApplicantsDiff: number;
  averagePreferenceCount: number;
  averagePreferenceCountHistory: Record<string, number>;
  averagePreferenceCountDiff: number;
  pointsEntranceGap: number;
  pointsEntranceGapHistory: Record<string, number>;
  pointsEntranceGapDiff: number;
  oddsOfTransfer: number;
  oddsOfTransferHistory: Record<string, number>;
  oddsOfTransferDiff: number;
  waitingListAbsolute: number;
  waitingListAbsoluteHistory: Record<string, number>;
  waitingListAbsoluteDiff: number;
  retirement?: {
    totalRetirements: number;
    totalRetirementsHistory: Record<string, number>;
    totalRetirementsDiff: number;
    totalNewHires: number | null;
    totalNewHiresHistory: Record<string, number> | null;
    totalNewHiresDiff: number | null;
    netStaffingBalance: number | null;
    netStaffingBalanceHistory: Record<string, number> | null;
    netStaffingBalanceDiff: number | null;
  } | null;
}

// --- Helper: Αφαίρεση τόνων για τα κεφαλαία ---
const removeGreekAccents = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// --- Static Mock Data (Οι 14 KPIs/Δείκτες) - as requested by User ---
// NOTE: "Specialty" and "Division" in this static data will be overridden by active filters for display purposes


// Design System Colors: Clean & Semantic
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

// --- KPI Definitions (Structure only, values will be dynamic) ---
const KPI_METADATA = [
  {
    id: "success",
    title: "Αριθμός Μεταθέσεων",
    isPercent: false,
    inverted: false,
    infoWhat: "Ο ακριβής αριθμός των εκπαιδευτικών της ειδικότητάς αυτής που κατάφεραν να πάρουν μετάθεση.",
    infoWhy: 'Αποκαλύπτει τα πραγματικά οργανικά κενά που καλύφθηκαν. Δείχνει αν η ειδικότητά "ανοίγει" ή παραμένει στάσιμη.',
  },
  {
    id: "odds",
    title: "Ποσοστό Επιτυχίας",
    isPercent: true,
    inverted: false,
    infoWhat: "Το ποσοστό των εκπαιδευτικών που έκαναν αίτηση και τελικά πήραν μετάθεση.",
    infoWhy: 'Είναι ο πιο ρεαλιστικός δείκτης. Ποσοστά κάτω του 10% δείχνουν "κλειστή" ειδικότητα, ενώ 30%+ δείχνουν πολύ ρεαλιστικές ελπίδες.',
  },
  {
    id: "leaving",
    title: "Αιτήσεις Μετάθεσης",
    isPercent: false,
    inverted: true,
    infoWhat: "Το συνολικό πλήθος των εκπαιδευτικών της ειδικότητάς αυτής που υπέβαλαν αίτηση μετάθεσης.",
    infoWhy: "Αντικατοπτρίζει τον όγκο του ανταγωνισμού πανελλαδικά. Δείχνει πόσοι εκπαιδευτικοί διεκδικούν μια θέση.",
  },
  {
    id: "waiting",
    title: "Μη Ικανοποιηθέντες",
    isPercent: false,
    inverted: true,
    infoWhat: "Ο αριθμός των εκπαιδευτικών που έκαναν αίτηση αλλά δεν πήραν μετάθεση.",
    infoWhy: 'Δίνει μια ξεκάθαρη εικόνα για πόσα άτομα παραμένουν "στην ουρά" πανελλαδικά.',
  },
  {
    id: "base",
    title: "Βάση Μορίων",
    isPercent: false,
    inverted: true,
    infoWhat: "Τα χαμηλότερα μόρια με τα οποία πήρε κάποιος μετάθεση πανελλαδικά (εκτός ειδικών κατηγοριών).",
    infoWhy: 'Αποτελεί το απόλυτο "κατώφλι" για να φύγει κάποιος από την τρέχουσα θέση του.',
  },
  {
    id: "avg_succ",
    title: "Μ.Ο. Επιτυχόντων",
    isPercent: false,
    inverted: true,
    infoWhat: "Ο μέσος όρος των μορίων όλων των εκπαιδευτικών που κατάφεραν να πάρουν μετάθεση.",
    infoWhy: "Πιο αξιόπιστος δείκτης από τη Βάση, καθώς δεν επηρεάζεται από ακραίες τιμές εξαιρέσεων.",
  },
  {
    id: "avg_app",
    title: "Μ.Ο. Αιτούντων",
    isPercent: false,
    inverted: true,
    infoWhat: "Ο μέσος όρος των μορίων όλων των εκπαιδευτικών που έκαναν αίτηση μετάθεσης.",
    infoWhy: 'Αποκαλύπτει το "προφίλ" του ανταγωνισμού (π.χ. αν παλεύεις με άτομα με πολλά χρόνια προϋπηρεσίας).',
  },
  {
    id: "gap",
    title: "Απόκλιση Μορίων",
    isPercent: false,
    inverted: true,
    infoWhat: "Η διαφορά μορίων μεταξύ του Μέσου Όρου αυτών που πέτυχαν και αυτών που έκαναν αίτηση.",
    infoWhy: 'Μεγάλη απόκλιση σημαίνει "κλειστή" ειδικότητα. Μικρή απόκλιση δείχνει ευνοϊκότερες συνθήκες.',
  },
  {
    id: "active_reg",
    title: "Γεωγραφική Διασπορά",
    isPercent: true,
    inverted: false,
    infoWhat: "Το ποσοστό των περιοχών της Ελλάδας που άνοιξαν έστω και μία θέση.",
    infoWhy: "Δείχνει αν οι μεταθέσεις αφορούν λίγες μεγάλες πόλεις ή αν δίνονται ευκαιρίες παντού.",
  },
  {
    id: "range",
    title: "Εύρος Βάσεων",
    isPercent: false,
    inverted: false,
    infoWhat: "Η διαφορά μορίων μεταξύ της περιοχής με την υψηλότερη βάση και εκείνης με τη χαμηλότερη.",
    infoWhy: 'Μεγάλο εύρος σημαίνει ότι υπάρχουν "εύκολες" περιοχές που μπορούν να δηλωθούν στρατηγικά.',
  },
  {
    id: "pref",
    title: "Μέσος Αριθμός Προτιμ.",
    isPercent: false,
    inverted: false,
    infoWhat: "Ο μέσος αριθμός περιοχών που δηλώνουν οι εκπαιδευτικοί στην αίτησή τους.",
    infoWhy: "Αν ο μέσος όρος είναι μεγάλος, υπάρχει έντονη τάση φυγής και δηλώνονται τα πάντα.",
  },
  {
    id: "special",
    title: "Ειδικές Κατηγορίες",
    isPercent: true,
    inverted: true,
    infoWhat: "Το ποσοστό των θέσεων που καταλήφθηκαν από εκπαιδευτικούς ειδικών κατηγοριών.",
    infoWhy: "Αν το ποσοστό είναι υψηλό, ο πραγματικός ανταγωνισμός για τη γενική κατηγορία είναι πολύ σκληρότερος.",
  },
];

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

export default function SummaryPageClient() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();

  // Filter state from URL
  const division = searchParams.get("division") || "Πρωτοβάθμια Γενικής";
  const specialty = searchParams.get("specialty") || "ΠΕ70";

  // Data state
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // --- RESTORED LOGIC ---
  // URL Sync
  useEffect(() => {
    if (!searchParams.has("division") || !searchParams.has("specialty")) {
      const params = new URLSearchParams(searchParams.toString());
      if (!params.has("division")) params.set("division", "Πρωτοβάθμια Γενικής");
      if (!params.has("specialty")) params.set("specialty", "ΠΕ70");
      router.replace(`/stats/summary?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  // URL Update helper
  const updateFilters = (newDivision: string, newSpecialty: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("division", newDivision);
    params.set("specialty", newSpecialty);
    router.push(`/stats/summary?${params.toString()}`);
  };

  // Fetch filter data once
  useEffect(() => {
    fetch("/api/stats/filters")
      .then((r) => r.json())
      .then((data) => {
        setAllSpecialties(data.specialties ?? []);
        setDivisions(data.divisions ?? []);
      })
      .catch(console.error);
  }, []);
  // --- END RESTORED LOGIC ---

  // Filter specialties based on division
  const isPrimary = division === "Πρωτοβάθμια Γενικής" || division === "Πρωτοβάθμια Ειδικής";
  const isSecondary = division === "Δευτεροβάθμια Γενικής" || division === "Δευτεροβάθμια Ειδικής";

  const filteredSpecialties = allSpecialties
    .filter((s) => {
      if (isPrimary) return s.isPrimary;
      if (isSecondary) return s.isSecondary;
      return true;
    })
    .sort((a, b) => {
      if (!isSecondary) return 0; // no sorting for primary
      const order = ["ΠΕ", "ΤΕ", "ΔΕ"];
      const prefixOf = (code: string) => order.findIndex((p) => code.startsWith(p));
      const pa = prefixOf(a.code);
      const pb = prefixOf(b.code);
      const ga = pa === -1 ? 99 : pa;
      const gb = pb === -1 ? 99 : pb;
      if (ga !== gb) return ga - gb;
      return a.code.localeCompare(b.code, "el");
    });

  // When division changes, check if current specialty is still valid.
  // Note: We handle this manually in `handleDivisionChange` below to ensure atomic URL updates,
  // but it's safe to have this effect as a fallback.
  useEffect(() => {
    if (filteredSpecialties.length > 0) {
      const stillValid = filteredSpecialties.some((s) => s.code === specialty);
      if (!stillValid) {
         updateFilters(division, filteredSpecialties[0].code);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [division, allSpecialties]);

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDivision = e.target.value;
    // Determine the new valid specialties for the new division
    const newIsPrimary = newDivision === "Πρωτοβάθμια Γενικής" || newDivision === "Πρωτοβάθμια Ειδικής";
    const newIsSecondary = newDivision === "Δευτεροβάθμια Γενικής" || newDivision === "Δευτεροβάθμια Ειδικής";

    const newFilteredSpecialties = allSpecialties
      .filter((s) => {
        if (newIsPrimary) return s.isPrimary;
        if (newIsSecondary) return s.isSecondary;
        return true;
      })
      .sort((a, b) => {
         // sorting logic repeated for atomic sync
         if (!newIsSecondary) return 0;
         const order = ["ΠΕ", "ΤΕ", "ΔΕ"];
         const prefixOf = (code: string) => order.findIndex((p) => code.startsWith(p));
         const pa = prefixOf(a.code);
         const pb = prefixOf(b.code);
         const ga = pa === -1 ? 99 : pa;
         const gb = pb === -1 ? 99 : pb;
         if (ga !== gb) return ga - gb;
         return a.code.localeCompare(b.code, "el");
      });

    let newSpecialty = specialty;
    if (newFilteredSpecialties.length > 0) {
        const stillValid = newFilteredSpecialties.some(s => s.code === specialty);
        if (!stillValid) {
            newSpecialty = newFilteredSpecialties[0].code;
        }
    }

    updateFilters(newDivision, newSpecialty);
  };

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters(division, e.target.value);
  };

  // Division options fallback
  const uniqueDivisionNames = Array.from(new Set(divisions.map((d) => d.name)));
  const divisionOptions =
    uniqueDivisionNames.length > 0
      ? uniqueDivisionNames.map((name) => ({ value: name, label: name }))
      : [
          { value: "Πρωτοβάθμια Γενικής", label: "Πρωτοβάθμια Γενικής" },
          { value: "Πρωτοβάθμια Ειδικής", label: "Πρωτοβάθμια Ειδικής" },
          { value: "Δευτεροβάθμια Γενικής", label: "Δευτεροβάθμια Γενικής" },
          { value: "Δευτεροβάθμια Ειδικής", label: "Δευτεροβάθμια Ειδικής" },
        ];

  // Fetch analytics data when filters change
  useEffect(() => {
    setLoading(true);
    fetch(`/api/stats/summary?division=${encodeURIComponent(division)}&specialty=${encodeURIComponent(specialty)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setAnalytics(json.data);
        } else {
          setAnalytics(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching analytics:", err);
        setAnalytics(null);
      })
      .finally(() => setLoading(false));
  }, [division, specialty]);

  // Map active code back to name for display
  const activeSpecialtyObj = allSpecialties.find((s) => s.code === specialty);
  const activeSpecialtyNameOnly = activeSpecialtyObj ? activeSpecialtyObj.name : "";
  const activeCodeDisplay = activeSpecialtyObj ? activeSpecialtyObj.code : specialty;

  // Helper to transform history record into Recharts format
  const transformHistory = (history: Record<string, number> | undefined) => {
    if (!history) return [];
    return Object.entries(history)
      .map(([year, val]) => ({ year, val }))
      .sort((a, b) => a.year.localeCompare(b.year));
  };

  // Helper to transform top lists
  const transformTopList = (list: Record<string, number> | undefined) => {
    if (!list) return [];
    const entries = Object.entries(list)
      .map(([name, val]) => ({ name, val }))
      .sort((a, b) => b.val - a.val); // Sort descending
    const maxVal = Math.max(...entries.map((e) => e.val), 1);
    return entries.map((e) => ({ ...e, max: maxVal }));
  };

  // Build the dynamic data object for the UI
  const dashboardData = analytics ? {
    kpis: KPI_METADATA.map(meta => {
        let value = 0;
        let diff = 0;
        let historyObj = {};

        switch(meta.id) {
            case "success": value = analytics.successCount; diff = analytics.successCountDiff; historyObj = analytics.successCountHistory; break;
            case "odds": value = analytics.oddsOfTransfer; diff = analytics.oddsOfTransferDiff; historyObj = analytics.oddsOfTransferHistory; break;
            case "leaving": value = analytics.leavingCount; diff = analytics.leavingCountDiff; historyObj = analytics.leavingCountHistory; break;
            case "waiting": value = analytics.waitingListAbsolute; diff = analytics.waitingListAbsoluteDiff; historyObj = analytics.waitingListAbsoluteHistory; break;
            case "base": value = analytics.baseScore; diff = analytics.baseScoreDiff; historyObj = analytics.baseScoreHistory; break;
            case "avg_succ": value = analytics.avgScore; diff = analytics.avgScoreDiff; historyObj = analytics.avgScoreHistory; break;
            case "avg_app": value = analytics.avgScoreApplicants; diff = analytics.avgScoreApplicantsDiff; historyObj = analytics.avgScoreApplicantsHistory; break;
            case "gap": value = analytics.pointsEntranceGap; diff = analytics.pointsEntranceGapDiff; historyObj = analytics.pointsEntranceGapHistory; break;
            case "active_reg": value = analytics.activeRegionsRate; diff = analytics.activeRegionsRateDiff; historyObj = analytics.activeRegionsRateHistory; break;
            case "range": value = analytics.nationalPointsRange; diff = analytics.nationalPointsRangeDiff; historyObj = analytics.nationalPointsRangeHistory; break;
            case "pref": value = analytics.averagePreferenceCount; diff = analytics.averagePreferenceCountDiff; historyObj = analytics.averagePreferenceCountHistory; break;
            case "special": value = analytics.specialCategoryRate; diff = analytics.specialCategoryRateDiff; historyObj = analytics.specialCategoryRateHistory; break;
        }

        return {
            ...meta,
            value,
            diff,
            data: transformHistory(historyObj as Record<string, number>)
        };
    }),
    charts: {
        comparison: (() => {
            const baseHist = analytics.baseScoreHistory;
            const appHist = analytics.avgScoreApplicantsHistory;
            const years = Array.from(new Set([...Object.keys(baseHist), ...Object.keys(appHist)])).sort();
            
            // Omit the first 2 years completely as requested
            const relevantYears = years.slice(2);
            
            return relevantYears.map(y => {
                const base = baseHist[y] || 0;
                const avgApp = appHist[y] || 0;
                
                // If either is missing, show no bars to avoid confusing the user
                if (base === 0 || avgApp === 0) {
                    return { year: y, base: 0, avgApp: 0 };
                }
                
                return { year: y, base, avgApp };
            });
        })()
    },
    topDestinations: transformTopList(analytics.top5DestinationRegions),
    topCompetitive: transformTopList(analytics.top5CompetitiveRegions),
    topTargeting: transformTopList(analytics.top5Targeting1st),
    hrAnalytics: analytics.retirement ? {
      retirements: {
        value: analytics.retirement.totalRetirements,
        diff: analytics.retirement.totalRetirementsDiff,
        data: transformHistory(analytics.retirement.totalRetirementsHistory as Record<string, number>),
      },
      newHires: {
        value: analytics.retirement.totalNewHires,
        diff: analytics.retirement.totalNewHiresDiff,
        fallback2025: (analytics.retirement.totalNewHiresHistory as Record<string, number>)?.["2025"],
        data: (() => {
          const hist = analytics.retirement?.totalNewHiresHistory as Record<string, number> || {};
          const transformed = transformHistory(hist);
          if (analytics.retirement?.totalNewHires === null) {
            if (!transformed.find((d: any) => d.year === "2026")) {
              transformed.push({ year: "2026", val: 0 });
            }
          }
          return transformed;
        })()
      },
      netStaffingBalance: {
        value: analytics.retirement.netStaffingBalance,
        diff: analytics.retirement.netStaffingBalanceDiff,
        fallback2025: (analytics.retirement.netStaffingBalanceHistory as Record<string, number>)?.["2025"],
        data: (() => {
          const hist = analytics.retirement?.netStaffingBalanceHistory as Record<string, number> || {};
          const transformed = transformHistory(hist);
          if (analytics.retirement?.netStaffingBalance === null) {
            if (!transformed.find((d: any) => d.year === "2026")) {
              transformed.push({ year: "2026", val: 0 });
            }
          }
          return transformed;
        })()
      }
    } : null,
  } : null;



  return (
    <div className="flex flex-col items-center px-4 text-foreground antialiased min-h-screen bg-background font-inter">
      <div className="w-full max-w-7xl space-y-6 lg:space-y-8 pt-20 md:pt-24 pb-8">
        {/* --- Header with Seamless Dropdowns --- */}
        <div className="flex flex-col md:flex-row md:items-start justify-between bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <Link
                href={`/stats?division=${encodeURIComponent(division)}&specialty=${encodeURIComponent(specialty)}`}
                className="text-text-tertiary hover:text-primary-hover hover:bg-primary-soft transition-colors flex items-center text-xs font-bold px-3 py-1.5 rounded-xl border border-transparent hover:border-primary/20 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Επιστροφή στον Χάρτη
              </Link>

              {!isMobile && (
                <FilterSelect
                  value={division}
                  onChange={(v) => {
                    const newIsPrimary = v === "Πρωτοβάθμια Γενικής" || v === "Πρωτοβάθμια Ειδικής";
                    const newIsSecondary = v === "Δευτεροβάθμια Γενικής" || v === "Δευτεροβάθμια Ειδικής";
                    const newFiltered = allSpecialties
                      .filter((s) => (newIsPrimary ? s.isPrimary : newIsSecondary ? s.isSecondary : true))
                      .sort((a, b) => {
                        if (!newIsSecondary) return 0;
                        const order = ["ΠΕ", "ΤΕ", "ΔΕ"];
                        const prefixOf = (code: string) => order.findIndex((p) => code.startsWith(p));
                        const pa = prefixOf(a.code), pb = prefixOf(b.code);
                        if (pa !== pb) return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
                        return a.code.localeCompare(b.code, "el");
                      });
                    let newSpec = specialty;
                    if (newFiltered.length > 0 && !newFiltered.some((s) => s.code === specialty)) {
                      newSpec = newFiltered[0].code;
                    }
                    updateFilters(v, newSpec);
                  }}
                  options={divisionOptions}
                  padding="4px 12px"
                  background="var(--card)"
                  className="text-[10px] font-bold uppercase tracking-wider border border-border/20"
                />
              )}
            </div>

            {/* Dropdown Βαθμίδας - Visible only on mobile here (Row 2 on mobile) */}
            {isMobile && (
              <div className="mb-4">
                <FilterSelect
                  value={division}
                  onChange={(v) => {
                    const newIsPrimary = v === "Πρωτοβάθμια Γενικής" || v === "Πρωτοβάθμια Ειδικής";
                    const newIsSecondary = v === "Δευτεροβάθμια Γενικής" || v === "Δευτεροβάθμια Ειδικής";
                    const newFiltered = allSpecialties
                      .filter((s) => (newIsPrimary ? s.isPrimary : newIsSecondary ? s.isSecondary : true))
                      .sort((a, b) => {
                        if (!newIsSecondary) return 0;
                        const order = ["ΠΕ", "ΤΕ", "ΔΕ"];
                        const prefixOf = (code: string) => order.findIndex((p) => code.startsWith(p));
                        const pa = prefixOf(a.code), pb = prefixOf(b.code);
                        if (pa !== pb) return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
                        return a.code.localeCompare(b.code, "el");
                      });
                    let newSpec = specialty;
                    if (newFiltered.length > 0 && !newFiltered.some((s) => s.code === specialty)) {
                      newSpec = newFiltered[0].code;
                    }
                    updateFilters(v, newSpec);
                  }}
                  options={divisionOptions}
                  padding="4px 12px"
                  background="var(--card)"
                  className="text-[10px] font-bold uppercase tracking-wider border border-border/20 w-fit"
                />
              </div>
            )}

            <div className="flex items-center flex-wrap gap-4 mt-2">
              <FilterSelect
                value={specialty}
                onChange={(v) => updateFilters(division, v)}
                options={filteredSpecialties.map((s) => ({ value: s.code, label: s.code }))}
                padding="6px 16px"
                className="text-2xl sm:text-3xl font-extrabold"
                multiline={isMobile}
              />
              {!isMobile && (
                <span className="text-2xl sm:text-3xl font-bold text-text-quaternary tracking-tight">
                  {activeSpecialtyNameOnly}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* --- 12 KPI Cards Grid (Clean Layout) --- */}
        {!analytics && !loading ? (
             <div className="bg-card border border-border/60 shadow-sm p-12 rounded-4xl text-center">
                <Search className="w-12 h-12 text-text-quaternary/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Δεν βρέθηκαν στατιστικά</h3>
                <p className="text-sm text-text-tertiary max-w-sm mx-auto">
                    Δοκιμάστε να αλλάξετε την ειδικότητα ή τη βαθμίδα για να δείτε τα πανελλαδικά δεδομένα.
                </p>
             </div>
        ) : loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-card p-5 rounded-4xl border border-border/60 shadow-sm h-56 animate-pulse">
                        <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
                        <div className="h-20 bg-surface-dim rounded mt-auto"></div>
                    </div>
                ))}
             </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {dashboardData?.kpis.map((kpi) => {
                const isPositive = kpi.diff > 0;
                const isGood = kpi.inverted ? !isPositive : isPositive;
                const DiffIcon = isPositive ? TrendingUp : TrendingDown;

                const badgeClasses =
                    kpi.diff === 0
                        ? "text-text-tertiary bg-muted"
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
                        {/* Header with Title and Tooltip */}
                        <div className="flex items-center gap-1.5 relative group/tooltip">
                          <div className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest leading-tight">
                            {removeGreekAccents(kpi.title).toUpperCase()}
                          </div>
                          <Info className="w-3.5 h-3.5 text-text-quaternary hover:text-text-tertiary cursor-help transition-colors" />

                          {/* Tooltip Content */}
                          <div className="absolute left-0 top-6 hidden group-hover/tooltip:block w-64 bg-card border border-border text-left p-4 rounded-xl shadow-xl z-50 pointer-events-none">
                            <div className="mb-3">
                              <span className="text-[10px] font-extrabold text-info uppercase tracking-widest block mb-1">
                                ΤΙ ΕΙΝΑΙ
                              </span>
                              <span className="text-xs text-text-secondary leading-snug">
                                {kpi.infoWhat}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] font-extrabold text-text-quaternary uppercase tracking-widest block mb-1">
                                ΓΙΑΤΙ ΕΙΝΑΙ ΣΗΜΑΝΤΙΚΟ
                              </span>
                              <span className="text-xs text-text-secondary leading-snug">
                                {kpi.infoWhy}
                              </span>
                            </div>
                            <div className="absolute -top-1 left-4 w-2.5 h-2.5 bg-card border-l border-t border-border transform rotate-45"></div>
                          </div>
                        </div>

                        {/* Semantic Diff Badge */}
                        {kpi.diff !== 0 && (
                          <div
                            className={`text-[10px] whitespace-nowrap font-bold px-2 py-0.5 rounded-2xl flex items-center h-fit ${badgeClasses}`}
                          >
                            {isPositive ? "+" : ""}
                            {kpi.diff}
                            {kpi.isPercent ? "%" : ""}{" "}
                            <DiffIcon
                              className="w-3 h-3 ml-0.5"
                              strokeWidth={2.5}
                            />
                          </div>
                        )}
                      </div>

                      <div className="text-3xl mt-1 font-extrabold tracking-tight text-foreground">
                        {kpi.value}
                        {kpi.isPercent ? "%" : ""}
                      </div>
                    </div>

                    {/* Pure Recharts Sparkline (Clean Colors) */}
                    <div className="h-20 w-full mt-auto">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={kpi.data}
                          margin={{ top: 15, right: 0, bottom: 0, left: 0 }}
                        >
                          <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fontSize: 10,
                              fill: "var(--text-tertiary)",
                              fontWeight: 500,
                            }}
                            dy={5}
                          />
                          <RechartsTooltip
                            cursor={{ fill: "var(--muted)" }}
                            contentStyle={{ display: "none" }}
                          />
                          <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                            <LabelList
                              dataKey="val"
                              position="top"
                              formatter={(value: any) =>
                                `${value}${kpi.isPercent ? "%" : ""}`
                              }
                              content={(props: any) => {
                                const { x, y, value, index } = props;
                                const isLast = index === kpi.data.length - 1;
                                return (
                                  <text
                                    x={x + props.width / 2}
                                    y={y - 5}
                                    fill={
                                      isLast
                                        ? theme.labels.current
                                        : theme.labels.past
                                    }
                                    fontSize={10}
                                    fontWeight={600}
                                    textAnchor="middle"
                                  >
                                    {value}
                                    {kpi.isPercent ? "%" : ""}
                                  </text>
                                );
                              }}
                            />
                            {kpi.data.map((entry, index) => {
                              const isLast = index === kpi.data.length - 1;
                              return (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    isLast ? theme.bars.current : theme.bars.past
                                  }
                                />
                              );
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* --- HR Analytics (Retirements & New Hires & Net Staffing) --- */}
            {dashboardData?.hrAnalytics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-6 lg:mt-8 mb-6 lg:mb-8">
                {/* Retirements Card */}
                <div className="bg-card p-5 rounded-4xl border border-border shadow-soft hover:shadow-floating hover:border-primary/30 transition-all flex flex-col justify-between h-56 group">
                  <div>
                    <div className="flex justify-between items-start mb-1 h-8">
                      <div className="flex items-center gap-1.5 relative group/tooltip">
                        <div className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest leading-tight">
                          ΑΠΟΧΩΡΗΣΕΙΣ
                        </div>
                        <Info className="w-3.5 h-3.5 text-text-quaternary hover:text-text-tertiary cursor-help transition-colors" />
                        <div className="absolute left-0 top-6 hidden group-hover/tooltip:block w-64 bg-card border border-border text-left p-4 rounded-xl shadow-xl z-50 pointer-events-none">
                          <div className="mb-3">
                            <span className="text-[10px] font-extrabold text-info uppercase tracking-widest block mb-1">ΤΙ ΕΙΝΑΙ</span>
                            <span className="text-xs text-text-secondary leading-snug">Ο συνολικός αριθμός των εκπαιδευτικών της ειδικότητάς που συνταξιοδοτήθηκαν ή παραιτήθηκαν οριστικά από την υπηρεσία.</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold text-text-quaternary uppercase tracking-widest block mb-1">ΓΙΑΤΙ ΕΙΝΑΙ ΣΗΜΑΝΤΙΚΟ</span>
                            <span className="text-xs text-text-secondary leading-snug">Αποτελεί την κύρια πηγή δημιουργίας νέων, πραγματικών οργανικών κενών. Ένας υψηλός αριθμός αποχωρήσεων συνήθως &quot;ξεκλειδώνει&quot; περισσότερες θέσεις για τις μεταθέσεις της επόμενης χρονιάς.</span>
                          </div>
                          <div className="absolute -top-1 left-4 w-2.5 h-2.5 bg-card border-l border-t border-border transform rotate-45"></div>
                        </div>
                      </div>
                      {dashboardData.hrAnalytics.retirements.diff !== 0 && (
                        <div className={`text-[10px] whitespace-nowrap font-bold px-2 py-0.5 rounded-2xl flex items-center h-fit ${dashboardData.hrAnalytics.retirements.diff > 0 ? "text-success bg-success-soft border border-success/20" : "text-danger bg-danger-soft border border-danger/20"}`}>
                          {dashboardData.hrAnalytics.retirements.diff > 0 ? "+" : ""}{dashboardData.hrAnalytics.retirements.diff}
                          {dashboardData.hrAnalytics.retirements.diff > 0 ? <TrendingUp className="w-3 h-3 ml-0.5" strokeWidth={2.5} /> : <TrendingDown className="w-3 h-3 ml-0.5" strokeWidth={2.5} />}
                        </div>
                      )}
                    </div>
                    <div className="text-3xl mt-1 font-extrabold tracking-tight text-foreground">
                      {dashboardData.hrAnalytics.retirements.value}
                    </div>
                  </div>
                  <div className="h-20 w-full mt-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData.hrAnalytics.retirements.data} margin={{ top: 15, right: 0, bottom: 0, left: 0 }}>
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--text-tertiary)", fontWeight: 500 }} dy={5} />
                        <RechartsTooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ display: "none" }} />
                        <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                          <LabelList dataKey="val" position="top" formatter={(value: any) => value} content={(props: any) => {
                            const { x, y, value, index } = props;
                            const isLast = index === dashboardData.hrAnalytics!.retirements.data.length - 1;
                            return (
                              <text x={x + props.width / 2} y={y - 5} fill={isLast ? theme.labels.current : theme.labels.past} fontSize={10} fontWeight={600} textAnchor="middle">
                                {value}
                              </text>
                            );
                          }} />
                          {dashboardData.hrAnalytics.retirements.data.map((entry, index) => {
                            const isLast = index === dashboardData.hrAnalytics!.retirements.data.length - 1;
                            return <Cell key={`cell-${index}`} fill={isLast ? theme.bars.current : theme.bars.past} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* New Hires Card */}
                <div className="bg-card p-5 rounded-4xl border border-border shadow-soft hover:shadow-floating hover:border-primary/30 transition-all flex flex-col justify-between h-56 group">
                  <div>
                    <div className="flex justify-between items-start mb-1 h-8">
                      <div className="flex items-center gap-1.5 relative group/tooltip">
                        <div className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest leading-tight">
                          ΔΙΟΡΙΣΜΟΙ
                        </div>
                        <Info className="w-3.5 h-3.5 text-text-quaternary hover:text-text-tertiary cursor-help transition-colors" />
                        <div className="absolute left-0 top-6 hidden group-hover/tooltip:block w-64 bg-card border border-border text-left p-4 rounded-xl shadow-xl z-50 pointer-events-none">
                          <div className="mb-3">
                            <span className="text-[10px] font-extrabold text-info uppercase tracking-widest block mb-1">ΤΙ ΕΙΝΑΙ</span>
                            <span className="text-xs text-text-secondary leading-snug">Ο συνολικός αριθμός των εκπαιδευτικών που διορίστηκαν μόνιμα στην ειδικότητά σας.</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold text-text-quaternary uppercase tracking-widest block mb-1">ΓΙΑΤΙ ΕΙΝΑΙ ΣΗΜΑΝΤΙΚΟ</span>
                            <span className="text-xs text-text-secondary leading-snug">Δείχνει τον βαθμό αναπλήρωσης του κλάδου. Οι μαζικοί διορισμοί καλύπτουν τα κενά, γεγονός που μακροπρόθεσμα μπορεί να μειώσει τις ευκαιρίες μετάθεσης και να αυξήσει τον ανταγωνισμό.</span>
                          </div>
                          <div className="absolute -top-1 left-4 w-2.5 h-2.5 bg-card border-l border-t border-border transform rotate-45"></div>
                        </div>
                      </div>
                      {dashboardData.hrAnalytics.newHires.diff !== 0 && dashboardData.hrAnalytics.newHires.diff !== null && (
                        <div className={`text-[10px] whitespace-nowrap font-bold px-2 py-0.5 rounded-2xl flex items-center h-fit ${dashboardData.hrAnalytics.newHires.diff > 0 ? "text-success bg-success-soft border border-success/20" : "text-danger bg-danger-soft border border-danger/20"}`}>
                          {dashboardData.hrAnalytics.newHires.diff > 0 ? "+" : ""}{dashboardData.hrAnalytics.newHires.diff}
                          {dashboardData.hrAnalytics.newHires.diff > 0 ? <TrendingUp className="w-3 h-3 ml-0.5" strokeWidth={2.5} /> : <TrendingDown className="w-3 h-3 ml-0.5" strokeWidth={2.5} />}
                        </div>
                      )}
                    </div>
                    <div className="text-3xl mt-1 font-extrabold tracking-tight text-foreground">
                      {dashboardData.hrAnalytics.newHires.value === null ? (
                        <span className="text-text-tertiary text-3xl">
                          {dashboardData.hrAnalytics.newHires.fallback2025 !== undefined ? `${dashboardData.hrAnalytics.newHires.fallback2025} (2025)` : "N/A"}
                        </span>
                      ) : (
                        dashboardData.hrAnalytics.newHires.value
                      )}
                    </div>
                  </div>
                  <div className="h-20 w-full mt-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData.hrAnalytics.newHires.data} margin={{ top: 15, right: 0, bottom: 0, left: 0 }}>
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--text-tertiary)", fontWeight: 500 }} dy={5} />
                        <RechartsTooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ display: "none" }} />
                        <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                          <LabelList dataKey="val" position="top" formatter={(value: any) => value} content={(props: any) => {
                            const { x, y, value, index } = props;
                            const isLast = index === dashboardData.hrAnalytics!.newHires.data.length - 1;
                            const isNullFallback = isLast && dashboardData.hrAnalytics!.newHires.value === null;
                            if (isNullFallback) return null; // No label if the bar is artificially 0 for a null current year
                            return (
                              <text x={x + props.width / 2} y={y - 5} fill={isLast ? theme.labels.current : theme.labels.past} fontSize={10} fontWeight={600} textAnchor="middle">
                                {value}
                              </text>
                            );
                          }} />
                          {dashboardData.hrAnalytics.newHires.data.map((entry, index) => {
                            const isLast = index === dashboardData.hrAnalytics!.newHires.data.length - 1;
                            return <Cell key={`cell-${index}`} fill={isLast ? theme.bars.current : theme.bars.past} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Net Staffing Balance Card */}
                <div className="bg-card p-5 rounded-4xl border border-border shadow-soft hover:shadow-floating hover:border-primary/30 transition-all flex flex-col justify-between h-56 group">
                  <div>
                    <div className="flex justify-between items-start mb-1 h-8">
                      <div className="flex items-center gap-1.5 relative group/tooltip">
                        <div className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest leading-tight">
                          ΙΣΟΖΥΓΙΟ ΠΡΟΣΩΠΙΚΟΥ
                        </div>
                        <Info className="w-3.5 h-3.5 text-text-quaternary hover:text-text-tertiary cursor-help transition-colors" />
                        <div className="absolute right-0 lg:left-0 lg:right-auto top-6 hidden group-hover/tooltip:block w-64 bg-card border border-border text-left p-4 rounded-xl shadow-xl z-50 pointer-events-none">
                          <div className="mb-3">
                            <span className="text-[10px] font-extrabold text-info uppercase tracking-widest block mb-1">ΤΙ ΕΙΝΑΙ</span>
                            <span className="text-xs text-text-secondary leading-snug">Η μαθηματική διαφορά μεταξύ των νέων διορισμών και των αποχωρήσεων (Διορισμοί μείον Αποχωρήσεις) για τη συγκεκριμένη χρονιά.</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold text-text-quaternary uppercase tracking-widest block mb-1">ΓΙΑΤΙ ΕΙΝΑΙ ΣΗΜΑΝΤΙΚΟ</span>
                            <span className="text-xs text-text-secondary leading-snug">Αποκαλύπτει τη &quot;δυναμική&quot; του κλάδου. Αρνητικό ισοζύγιο σημαίνει ότι η ειδικότητα &quot;αδειάζει&quot; (άρα θα προκύψουν ευκαιρίες μετάθεσης), ενώ θετικό δείχνει κορεσμό και σταδιακό κλείσιμο διαθέσιμων θέσεων.</span>
                          </div>
                          <div className="absolute -top-1 right-4 lg:left-4 lg:right-auto w-2.5 h-2.5 bg-card border-l border-t border-border transform rotate-45"></div>
                        </div>
                      </div>
                      {dashboardData.hrAnalytics.netStaffingBalance.diff !== 0 && dashboardData.hrAnalytics.netStaffingBalance.diff !== null && (
                        <div className={`text-[10px] whitespace-nowrap font-bold px-2 py-0.5 rounded-2xl flex items-center h-fit ${dashboardData.hrAnalytics.netStaffingBalance.diff > 0 ? "text-success bg-success-soft border border-success/20" : "text-danger bg-danger-soft border border-danger/20"}`}>
                          {dashboardData.hrAnalytics.netStaffingBalance.diff > 0 ? "+" : ""}{dashboardData.hrAnalytics.netStaffingBalance.diff}
                          {dashboardData.hrAnalytics.netStaffingBalance.diff > 0 ? <TrendingUp className="w-3 h-3 ml-0.5" strokeWidth={2.5} /> : <TrendingDown className="w-3 h-3 ml-0.5" strokeWidth={2.5} />}
                        </div>
                      )}
                    </div>
                    <div className="text-3xl mt-1 font-extrabold tracking-tight text-foreground">
                      {dashboardData.hrAnalytics.netStaffingBalance.value === null ? (
                        <span className="text-text-tertiary text-3xl">
                          {dashboardData.hrAnalytics.netStaffingBalance.fallback2025 !== undefined ? `${dashboardData.hrAnalytics.netStaffingBalance.fallback2025} (2025)` : "N/A"}
                        </span>
                      ) : (
                        dashboardData.hrAnalytics.netStaffingBalance.value
                      )}
                    </div>
                  </div>
                  <div className="h-20 w-full mt-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData.hrAnalytics.netStaffingBalance.data} margin={{ top: 15, right: 0, bottom: 0, left: 0 }}>
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--text-tertiary)", fontWeight: 500 }} dy={5} />
                        <RechartsTooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ display: "none" }} />
                        <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                          <LabelList dataKey="val" position="top" formatter={(value: any) => value} content={(props: any) => {
                            const { x, y, value, index } = props;
                            const isLast = index === dashboardData.hrAnalytics!.netStaffingBalance.data.length - 1;
                            const isNullFallback = isLast && dashboardData.hrAnalytics!.netStaffingBalance.value === null;
                            if (isNullFallback) return null; // No label if the bar is artificially 0 for a null current year
                            return (
                              <text x={x + props.width / 2} y={y - 5} fill={isLast ? theme.labels.current : theme.labels.past} fontSize={10} fontWeight={600} textAnchor="middle">
                                {value}
                              </text>
                            );
                          }} />
                          {dashboardData.hrAnalytics.netStaffingBalance.data.map((entry, index) => {
                            const isLast = index === dashboardData.hrAnalytics!.netStaffingBalance.data.length - 1;
                            return <Cell key={`cell-${index}`} fill={isLast ? theme.bars.current : theme.bars.past} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* --- Comparison Chart (Clean) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl flex flex-col">
                <div className="flex flex-col xl:flex-row justify-between items-start mb-6 gap-4 xl:gap-0">
                  <div>
                      <div className="flex items-center gap-2 relative group/tooltip w-fit xl:mb-4">
                        <h3 className="text-xl font-bold text-foreground tracking-tight">
                          Σύγκριση Μ.Ο. Αιτούντων & Βάσεων
                        </h3>
                        <Info className="w-5 h-5 text-text-quaternary hover:text-text-tertiary cursor-help transition-colors" />
                        <div className="absolute left-0 top-8 hidden group-hover/tooltip:block w-72 sm:w-80 bg-card border border-border text-left p-4 rounded-xl shadow-xl z-50 pointer-events-none font-sans">
                          <div className="mb-3">
                            <span className="text-[10px] font-extrabold text-info uppercase tracking-widest block mb-1">ΤΙ ΕΙΝΑΙ</span>
                            <span className="text-xs text-text-secondary leading-snug font-normal">Απεικονίζει τη διαχρονική εξέλιξη του Μέσου Όρου των Μορίων των Αιτούντων σε σχέση με τη Βάση (τα μόρια του τελευταίου μετατεθέντα).</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold text-text-quaternary uppercase tracking-widest block mb-1">ΓΙΑΤΙ ΕΙΝΑΙ ΣΗΜΑΝΤΙΚΟ</span>
                            <span className="text-xs text-text-secondary leading-snug font-normal">Δείχνει την τάση του ανταγωνισμού και τη δυσκολία της χρονιάς, βοηθώντας σας να κατανοήσετε αν οι βάσεις κινούνται ανοδικά ή καθοδικά.</span>
                          </div>
                          <div className="absolute -top-1 left-6 w-2.5 h-2.5 bg-card border-l border-t border-border transform rotate-45"></div>
                        </div>
                      </div>
                  </div>
                  <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
                      <div className="w-3 h-3 rounded-sm bg-primary"></div> ΒΑΣΗ
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-muted"></div>{" "}
                      ΑΙΤΟΥΝΤΕΣ
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-[220px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData?.charts.comparison}
                      margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--border-dim)"
                      />
                      <XAxis
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "var(--text-tertiary)", fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "var(--text-quaternary)" }}
                      />
                      <RechartsTooltip
                         cursor={{ fill: "var(--muted)" }}
                         contentStyle={{
                           borderRadius: "12px",
                           border: "1px solid var(--border)",
                           fontSize: "12px",
                           backgroundColor: "var(--card)",
                           color: "var(--foreground)"
                         }}
                         itemStyle={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}
                         labelStyle={{ color: "var(--text-tertiary)", fontWeight: 700, marginBottom: "4px" }}
                       />
                      <Bar
                        dataKey="base"
                        fill="var(--primary)"
                        radius={[4, 4, 0, 0]}
                        name="Βάση"
                      />
                      <Bar
                        dataKey="avgApp"
                         fill="var(--border-strong)"
                        radius={[4, 4, 0, 0]}
                        name="Μ.Ο. Αιτούντων"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl flex flex-col justify-start items-start text-left">
                <div className="flex items-center gap-2 relative group/tooltip w-fit mb-4">
                  <h3 className="text-xl font-bold text-foreground">
                  Δημοφιλείς Περιοχές (1η Προτίμηση)
                  </h3>
                  <Info className="w-5 h-5 text-text-quaternary hover:text-text-tertiary cursor-help transition-colors" />
                  <div className="absolute left-0 top-8 hidden group-hover/tooltip:block w-72 sm:w-80 bg-card border border-border text-left p-4 rounded-xl shadow-xl z-50 pointer-events-none font-sans">
                    <div className="mb-3">
                      <span className="text-[10px] font-extrabold text-info uppercase tracking-widest block mb-1">ΤΙ ΕΙΝΑΙ</span>
                      <span className="text-xs text-text-secondary leading-snug font-normal">Οι 5 περιοχές που δηλώθηκαν περισσότερο ως πρώτη (1η) επιλογή από τους εκπαιδευτικούς της ειδικότητάς σας κατά την τελευταία χρονιά.</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-text-quaternary uppercase tracking-widest block mb-1">ΓΙΑΤΙ ΕΙΝΑΙ ΣΗΜΑΝΤΙΚΟ</span>
                      <span className="text-xs text-text-secondary leading-snug font-normal">Σας δείχνει τις περιοχές με τον υψηλότερο ανταγωνισμό και τη μεγαλύτερη συγκέντρωση ζήτησης, βοηθώντας σας να αξιολογήσετε τις δικές σας επιλογές.</span>
                    </div>
                    <div className="absolute -top-1 left-6 w-2.5 h-2.5 bg-card border-l border-t border-border transform rotate-45"></div>
                  </div>
                </div>
                <div className="w-full space-y-6">
                    {dashboardData?.topTargeting.map((item, idx) => (
                        <div key={idx} className="group cursor-pointer">
                             <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-semibold text-text-secondary group-hover:text-primary-hover transition-colors">
                                    {item.name}
                                </span>
                                <span className="text-[11px] bg-muted border border-border px-2 py-0.5 rounded-2xl shadow-sm">
                                    <span className="font-extrabold text-foreground">{item.val}</span>
                                    <span className="text-text-tertiary ml-1">άτομα</span>
                                </span>
                             </div>
                             <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-inner">
                                <motion.div
                                    className="bg-gradient-to-r from-primary/70 to-primary h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${(item.val / item.max) * 100}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    ))}
                    {dashboardData?.topTargeting.length === 0 && (
                        <p className="text-sm text-text-quaternary italic">Δεν υπάρχουν διαθέσιμα δεδομένα ζήτησης.</p>
                    )}
                </div>
              </div>
            </div>



            {/* --- Rankings Area (Top 5) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Card 1: Top Destinations */}
              <div className="bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl flex flex-col justify-start items-start text-left">
                <div className="flex items-center gap-2 relative group/tooltip w-fit mb-4">
                  <h3 className="text-xl font-bold text-foreground">
                    Κορυφαίοι Προορισμοί Απορρόφησης
                  </h3>
                  <Info className="w-5 h-5 text-text-quaternary hover:text-text-tertiary cursor-help transition-colors" />
                  <div className="absolute left-0 top-8 hidden group-hover/tooltip:block w-72 sm:w-80 bg-card border border-border text-left p-4 rounded-xl shadow-xl z-50 pointer-events-none font-sans z-[60]">
                    <div className="mb-3">
                      <span className="text-[10px] font-extrabold text-info uppercase tracking-widest block mb-1">ΤΙ ΕΙΝΑΙ</span>
                      <span className="text-xs text-text-secondary leading-snug font-normal">Οι περιοχές όπου πραγματοποιήθηκαν οι περισσότερες μεταθέσεις (μεγαλύτερος αριθμός ατόμων που μετακινήθηκαν) την τελευταία χρονιά.</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-text-quaternary uppercase tracking-widest block mb-1">ΓΙΑΤΙ ΕΙΝΑΙ ΣΗΜΑΝΤΙΚΟ</span>
                      <span className="text-xs text-text-secondary leading-snug font-normal">Υποδεικνύει ποιες περιοχές εμφανίζουν ιστορικά τα μεγαλύτερα οργανικά κενά ή κινητικότητα, αυξάνοντας στατιστικά τις πιθανότητες μετάθεσης.</span>
                    </div>
                    <div className="absolute -top-1 left-6 w-2.5 h-2.5 bg-card border-l border-t border-border transform rotate-45"></div>
                  </div>
                </div>
                <div className="w-full space-y-6">
                  {dashboardData?.topDestinations.map((item, idx) => (
                    <div key={idx} className="group cursor-pointer">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-semibold text-text-secondary group-hover:text-primary-hover transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[11px] bg-muted border border-border px-2 py-0.5 rounded-2xl shadow-sm">
                          <span className="font-extrabold text-foreground">{item.val}</span>
                          <span className="text-text-tertiary ml-1">θέσεις</span>
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-inner">
                        <motion.div
                          className="bg-gradient-to-r from-primary/70 to-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(item.val / item.max) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Top Competitive */}
              <div className="bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl flex flex-col justify-start items-start text-left">
                <div className="flex items-center gap-2 relative group/tooltip w-fit mb-4">
                  <h3 className="text-xl font-bold text-foreground">
                    Περιοχές με τις Υψηλότερες Βάσεις
                  </h3>
                  <Info className="w-5 h-5 text-text-quaternary hover:text-text-tertiary cursor-help transition-colors" />
                  <div className="absolute right-0 sm:left-0 sm:right-auto top-8 hidden group-hover/tooltip:block w-72 sm:w-80 bg-card border border-border text-left p-4 rounded-xl shadow-xl z-[60] pointer-events-none font-sans">
                    <div className="mb-3">
                      <span className="text-[10px] font-extrabold text-info uppercase tracking-widest block mb-1">ΤΙ ΕΙΝΑΙ</span>
                      <span className="text-xs text-text-secondary leading-snug font-normal">Οι περιοχές που απαίτησαν τα περισσότερα μόρια για μετάθεση (βάση τελευταίου μετατεθέντα) κατά την τελευταία χρονιά.</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-text-quaternary uppercase tracking-widest block mb-1">ΓΙΑΤΙ ΕΙΝΑΙ ΣΗΜΑΝΤΙΚΟ</span>
                      <span className="text-xs text-text-secondary leading-snug font-normal">Σας βοηθά να εντοπίσετε τους πιο "απρόσιτους" ή απαιτητικούς προορισμούς, ώστε να ρυθμίσετε ρεαλιστικά τη στρατηγική των δηλώσεών σας.</span>
                    </div>
                    <div className="absolute -top-1 right-6 sm:right-auto sm:left-6 w-2.5 h-2.5 bg-card border-l border-t border-border transform rotate-45"></div>
                  </div>
                </div>
                <div className="w-full space-y-6">
                  {dashboardData?.topCompetitive.map((item, idx) => (
                    <div key={idx} className="group cursor-pointer">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-semibold text-text-secondary group-hover:text-primary transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[11px] bg-muted border border-border px-2 py-0.5 rounded-2xl shadow-sm">
                          <span className="font-extrabold text-foreground">{item.val}</span>
                          <span className="text-text-tertiary ml-1">μόρια</span>
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-inner">
                        <motion.div
                          className="bg-gradient-to-r from-primary/70 to-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(item.val / item.max) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}


      </div>
    </div>
  );
}
