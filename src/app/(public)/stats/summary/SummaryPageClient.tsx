"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
            return years.map(y => ({
                year: y,
                base: baseHist[y] || 0,
                avgApp: appHist[y] || 0
            }));
        })()
    },
    topDestinations: transformTopList(analytics.top5DestinationRegions),
    topCompetitive: transformTopList(analytics.top5CompetitiveRegions),
    topTargeting: transformTopList(analytics.top5Targeting1st),
  } : null;



  return (
    <div className="p-4 md:p-8 text-foreground antialiased min-h-screen bg-background font-inter">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 pt-20 md:pt-24">
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

            {/* --- Comparison Chart (Clean) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">
                      Σύγκριση Μορίων & Βάσεων
                    </h3>
                    <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                      {removeGreekAccents(
                        "Πού κυμαίνεται η βάση σε σχέση με τη μάζα"
                      ).toUpperCase()}
                    </p>
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
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-surface-dim border border-border-dim text-text-tertiary">
                        <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                    Στρατηγική Ανάλυση
                    </h3>
                </div>
                <div className="w-full space-y-4">
                    <p className="text-xs text-text-tertiary mb-2 uppercase tracking-widest font-bold">ΠΕΡΙΟΧΕΣ ΜΕ ΤΗ ΜΕΓΑΛΥΤΕΡΗ ΖΗΤΗΣΗ (1η ΠΡΟΤΙΜΗΣΗ)</p>
                    {dashboardData?.topTargeting.map((item, idx) => (
                        <div key={idx} className="group">
                             <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-semibold text-text-secondary group-hover:text-primary-hover transition-colors">
                                    {item.name}
                                </span>
                                <span className="text-[11px] font-bold text-text-tertiary bg-muted border border-border px-2 py-0.5 rounded-2xl shadow-sm">
                                    {item.val} άτομα
                                </span>
                             </div>
                             <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-primary h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: `${(item.val / item.max) * 100}%` }}
                                ></div>
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
            <div className="bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-border-dim pb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-surface-dim border border-border-dim text-text-tertiary">
                      <Map className="w-5 h-5" />
                    </div>
                    Γεωγραφική Ανάλυση Ειδικότητας
                  </h3>
                  <p className="text-xs font-medium text-text-tertiary mt-2 pl-12">
                    Ποιες περιοχές απορρόφησαν τον κόσμο & ποιες απαιτούν τα
                    περισσότερα μόρια.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                {/* List 1: Top Destinations */}
                <div>
                  <h4 className="text-[10px] font-bold text-text-quaternary uppercase tracking-widest mb-6 pb-2 border-b border-border-dim">
                    13. ΚΟΡΥΦΑΙΟΙ ΠΡΟΟΡΙΣΜΟΙ ΑΠΟΡΡΟΦΗΣΗΣ
                  </h4>
                  <div className="space-y-6">
                    {dashboardData?.topDestinations.map((item, idx) => (
                      <div key={idx} className="group cursor-pointer">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-semibold text-text-secondary group-hover:text-primary-hover transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[11px] font-bold text-text-tertiary bg-muted border border-border px-2 py-0.5 rounded-2xl shadow-sm">
                            {item.val} θέσεις
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${(item.val / item.max) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* List 2: Top Competitive */}
                <div>
                  <h4 className="text-[10px] font-bold text-text-quaternary uppercase tracking-widest mb-6 pb-2 border-b border-border-dim">
                    14. ΠΕΡΙΟΧΕΣ ΜΕ ΤΙΣ ΥΨΗΛΟΤΕΡΕΣ ΒΑΣΕΙΣ
                  </h4>
                  <div className="space-y-6">
                    {dashboardData?.topCompetitive.map((item, idx) => (
                      <div key={idx} className="group cursor-pointer">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-semibold text-text-secondary group-hover:text-primary transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[11px] font-bold text-text-tertiary bg-muted border border-border px-2 py-0.5 rounded-2xl shadow-sm">
                            {item.val} μόρια
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${(item.val / item.max) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}


      </div>
    </div>
  );
}
