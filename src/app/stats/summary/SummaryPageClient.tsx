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

// --- Custom Internal Filter Component (Matching main stats page) ---
interface FilterSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  fullWidth?: boolean;
  fontSize?: string;
  fontWeight?: string | number;
  padding?: string;
  background?: string;
  className?: string;
}

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  fullWidth,
  fontSize,
  fontWeight,
  padding = "8px 16px",
  background = "rgba(255,255,255,0.9)",
  className = "",
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const label = options.find((o) => o.value === value)?.label || placeholder || value;

  return (
    <div ref={containerRef} className="relative inline-block" style={fullWidth ? { width: "100%" } : {}}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`transition-all ${className}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: padding,
          background: background,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(226,232,240,0.8)",
          borderRadius: "12px",
          fontSize: fontSize,
          fontWeight: fontWeight,
          color: "#0f172a",
          cursor: "pointer",
          whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          transition: "all 0.2s",
          ...(fullWidth ? { width: "100%", justifyContent: "space-between" } : {}),
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#fff";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = background;
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
        }}
      >
        <span>{label}</span>
        <ChevronDown
          className="transition-transform duration-200"
          style={{
            width: "14px",
            height: "14px",
            color: "#64748b",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 9999,
            minWidth: "200px",
            maxHeight: "280px",
            overflowY: "auto",
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(226,232,240,0.8)",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            padding: "8px",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: 500,
                background: value === opt.value ? "rgba(14,165,233,0.08)" : "transparent",
                color: value === opt.value ? "#0ea5e9" : "#334155",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (value !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  value === opt.value ? "rgba(14,165,233,0.08)" : "transparent";
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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

// --- Helper: Αφαίρεση τόνων για τα κεφαλαία ---
const removeGreekAccents = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// --- Static Mock Data (Οι 14 KPIs/Δείκτες) - as requested by User ---
// NOTE: "Specialty" and "Division" in this static data will be overridden by active filters for display purposes
const mockDataStats = {
  kpis: [
    {
      id: "success",
      title: "Αριθμός Μεταθέσεων",
      value: 23,
      diff: 21,
      isPercent: false,
      inverted: false,
      data: [
        { year: "2024", val: 1 },
        { year: "2025", val: 2 },
        { year: "2026", val: 23 },
      ],
      infoWhat:
        "Ο ακριβής αριθμός των εκπαιδευτικών της ειδικότητάς αυτής που κατάφεραν να πάρουν μετάθεση.",
      infoWhy:
        'Αποκαλύπτει τα πραγματικά οργανικά κενά που καλύφθηκαν. Δείχνει αν η ειδικότητά "ανοίγει" ή παραμένει στάσιμη.',
    },
    {
      id: "odds",
      title: "Ποσοστό Επιτυχίας",
      value: 32.5,
      diff: 12.1,
      isPercent: true,
      inverted: false,
      data: [
        { year: "2024", val: 15.2 },
        { year: "2025", val: 20.4 },
        { year: "2026", val: 32.5 },
      ],
      infoWhat:
        "Το ποσοστό των εκπαιδευτικών που έκαναν αίτηση και τελικά πήραν μετάθεση.",
      infoWhy:
        'Είναι ο πιο ρεαλιστικός δείκτης. Ποσοστά κάτω του 10% δείχνουν "κλειστή" ειδικότητα, ενώ 30%+ δείχνουν πολύ ρεαλιστικές ελπίδες.',
    },
    {
      id: "leaving",
      title: "Αιτήσεις Μετάθεσης",
      value: 70,
      diff: -5,
      isPercent: false,
      inverted: true,
      data: [
        { year: "2024", val: 65 },
        { year: "2025", val: 75 },
        { year: "2026", val: 70 },
      ],
      infoWhat:
        "Το συνολικό πλήθος των εκπαιδευτικών της ειδικότητάς αυτής που υπέβαλαν αίτηση μετάθεσης.",
      infoWhy:
        "Αντικατοπτρίζει τον όγκο του ανταγωνισμού πανελλαδικά. Δείχνει πόσοι εκπαιδευτικοί διεκδικούν μια θέση.",
    },
    {
      id: "waiting",
      title: "Μη Ικανοποιηθέντες",
      value: 47,
      diff: -26,
      isPercent: false,
      inverted: true,
      data: [
        { year: "2024", val: 64 },
        { year: "2025", val: 73 },
        { year: "2026", val: 47 },
      ],
      infoWhat:
        "Ο αριθμός των εκπαιδευτικών που έκαναν αίτηση αλλά δεν πήραν μετάθεση.",
      infoWhy:
        'Δίνει μια ξεκάθαρη εικόνα για πόσα άτομα παραμένουν "στην ουρά" πανελλαδικά.',
    },
    {
      id: "base",
      title: "Βάση Μορίων",
      value: 40.41,
      diff: -46.57,
      isPercent: false,
      inverted: true,
      data: [
        { year: "2024", val: 81.69 },
        { year: "2025", val: 86.98 },
        { year: "2026", val: 40.41 },
      ],
      infoWhat:
        "Τα χαμηλότερα μόρια με τα οποία πήρε κάποιος μετάθεση πανελλαδικά (εκτός ειδικών κατηγοριών).",
      infoWhy:
        'Αποτελεί το απόλυτο "κατώφλι" για να φύγει κάποιος από την τρέχουσα θέση του.',
    },
    {
      id: "avg_succ",
      title: "Μ.Ο. Επιτυχόντων",
      value: 68.2,
      diff: -5.1,
      isPercent: false,
      inverted: true,
      data: [
        { year: "2024", val: 85.1 },
        { year: "2025", val: 73.3 },
        { year: "2026", val: 68.2 },
      ],
      infoWhat:
        "Ο μέσος όρος των μορίων όλων των εκπαιδευτικών που κατάφεραν να πάρουν μετάθεση.",
      infoWhy:
        "Πιο αξιόπιστος δείκτης από τη Βάση, καθώς δεν επηρεάζεται από ακραίες τιμές εξαιρέσεων.",
    },
    {
      id: "avg_app",
      title: "Μ.Ο. Αιτούντων",
      value: 55.4,
      diff: 2.3,
      isPercent: false,
      inverted: true,
      data: [
        { year: "2024", val: 51.2 },
        { year: "2025", val: 53.1 },
        { year: "2026", val: 55.4 },
      ],
      infoWhat:
        "Ο μέσος όρος των μορίων όλων των εκπαιδευτικών που έκαναν αίτηση μετάθεσης.",
      infoWhy:
        'Αποκαλύπτει το "προφίλ" του ανταγωνισμού (π.χ. αν παλεύεις με άτομα με πολλά χρόνια προϋπηρεσίας).',
    },
    {
      id: "gap",
      title: "Απόκλιση Μορίων",
      value: 12.8,
      diff: -7.4,
      isPercent: false,
      inverted: true,
      data: [
        { year: "2024", val: 33.9 },
        { year: "2025", val: 20.2 },
        { year: "2026", val: 12.8 },
      ],
      infoWhat:
        "Η διαφορά μορίων μεταξύ του Μέσου Όρου αυτών που πέτυχαν και αυτών που έκαναν αίτηση.",
      infoWhy:
        'Μεγάλη απόκλιση σημαίνει "κλειστή" ειδικότητα. Μικρή απόκλιση δείχνει ευνοϊκότερες συνθήκες.',
    },
    {
      id: "active_reg",
      title: "Γεωγραφική Διασπορά",
      value: 68.5,
      diff: 15.2,
      isPercent: true,
      inverted: false,
      data: [
        { year: "2024", val: 45.0 },
        { year: "2025", val: 53.3 },
        { year: "2026", val: 68.5 },
      ],
      infoWhat:
        "Το ποσοστό των περιοχών της Ελλάδας που άνοιξαν έστω και μία θέση.",
      infoWhy:
        "Δείχνει αν οι μεταθέσεις αφορούν λίγες μεγάλες πόλεις ή αν δίνονται ευκαιρίες παντού.",
    },
    {
      id: "range",
      title: "Εύρος Βάσεων",
      value: 45.1,
      diff: 10.5,
      isPercent: false,
      inverted: false,
      data: [
        { year: "2024", val: 30.5 },
        { year: "2025", val: 34.6 },
        { year: "2026", val: 45.1 },
      ],
      infoWhat:
        "Η διαφορά μορίων μεταξύ της περιοχής με την υψηλότερη βάση και εκείνης με τη χαμηλότερη.",
      infoWhy:
        'Μεγάλο εύρος σημαίνει ότι υπάρχουν "εύκολες" περιοχές που μπορούν να δηλωθούν στρατηγικά.',
    },
    {
      id: "pref",
      title: "Μέσος Αριθμός Προτιμ.",
      value: 18.5,
      diff: 2.1,
      isPercent: false,
      inverted: false,
      data: [
        { year: "2024", val: 14.2 },
        { year: "2025", val: 16.4 },
        { year: "2026", val: 18.5 },
      ],
      infoWhat:
        "Ο μέσος αριθμός περιοχών που δηλώνουν οι εκπαιδευτικοί στην αίτησή τους.",
      infoWhy:
        "Αν ο μέσος όρος είναι μεγάλος, υπάρχει έντονη τάση φυγής και δηλώνονται τα πάντα.",
    },
    {
      id: "special",
      title: "Ειδικές Κατηγορίες",
      value: 4.1,
      diff: 3.1,
      isPercent: true,
      inverted: true,
      data: [
        { year: "2024", val: 1.0 },
        { year: "2025", val: 1.0 },
        { year: "2026", val: 4.1 },
      ],
      infoWhat:
        "Το ποσοστό των θέσεων που καταλήφθηκαν από εκπαιδευτικούς ειδικών κατηγοριών.",
      infoWhy:
        "Αν το ποσοστό είναι υψηλό, ο πραγματικός ανταγωνισμός για τη γενική κατηγορία είναι πολύ σκληρότερος.",
    },
  ],
  charts: {
    comparison: [
      { year: "2024", base: 81.69, avgApp: 51.2 },
      { year: "2025", base: 86.98, avgApp: 53.1 },
      { year: "2026", base: 40.41, avgApp: 55.4 },
    ],
  },
  topDestinations: [
    { name: "Α' ΘΕΣΣΑΛΟΝΙΚΗΣ", val: 3, max: 3 },
    { name: "ΛΑΡΙΣΑΣ", val: 2, max: 3 },
    { name: "ΑΙΤΩΛΟΑΚΑΡΝΑΝΙΑΣ", val: 1, max: 3 },
    { name: "ΔΡΑΜΑΣ", val: 1, max: 3 },
    { name: "ΧΑΛΚΙΔΙΚΗΣ", val: 1, max: 3 },
  ],
  topCompetitive: [
    { name: "Α' ΘΕΣΣΑΛΟΝΙΚΗΣ", val: 85.5, max: 85.5 },
    { name: "Β' ΑΘΗΝΑΣ", val: 82.1, max: 85.5 },
    { name: "ΗΡΑΚΛΕΙΟΥ", val: 79.4, max: 85.5 },
    { name: "ΛΑΡΙΣΑΣ", val: 76.2, max: 85.5 },
    { name: "ΧΑΝΙΩΝ", val: 75.0, max: 85.5 },
  ],
};

// Design System Colors: Clean & Semantic
const theme = {
  bars: {
    past: "#cbd5e1", // slate-300
    current: "#0369a1", // sky-700 (Primary)
  },
  labels: {
    past: "#94a3b8", // slate-400
    current: "#0284c7", // sky-600
  },
};

export default function SummaryPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter state from URL
  const division = searchParams.get("division") || "Πρωτοβάθμια Γενικής";
  const specialty = searchParams.get("specialty") || "ΠΕ70";

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

  // Filter dynamic data
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);

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
  const divisionOptions =
    divisions.length > 0
      ? divisions.map((d) => ({ value: d.name, label: d.name }))
      : [
          { value: "Πρωτοβάθμια Γενικής", label: "Πρωτοβάθμια Γενικής" },
          { value: "Πρωτοβάθμια Ειδικής", label: "Πρωτοβάθμια Ειδικής" },
          { value: "Δευτεροβάθμια Γενικής", label: "Δευτεροβάθμια Γενικής" },
          { value: "Δευτεροβάθμια Ειδικής", label: "Δευτεροβάθμια Ειδικής" },
        ];

  // Map active code back to name for display
  const activeSpecialtyObj = allSpecialties.find((s) => s.code === specialty);
  const activeSpecialtyNameOnly = activeSpecialtyObj ? activeSpecialtyObj.name : "";
  const activeCodeDisplay = activeSpecialtyObj ? activeSpecialtyObj.code : specialty;


  return (
    <div className="p-4 md:p-8 text-slate-900 antialiased min-h-screen bg-[#f8fafc] font-inter mt-[80px]">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* --- Header with Seamless Dropdowns --- */}
        <div className="flex flex-col md:flex-row md:items-start justify-between bg-white border border-slate-200/60 shadow-sm p-6 sm:p-8 rounded-[2rem]">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <Link
                href={`/stats?division=${encodeURIComponent(division)}&specialty=${encodeURIComponent(specialty)}`}
                className="text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition-colors flex items-center text-xs font-bold px-3 py-1.5 rounded-xl border border-transparent hover:border-sky-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Επιστροφή στον Χάρτη
              </Link>

              {/* Dropdown Βαθμίδας */}
              <FilterSelect
                value={division}
                onChange={(v) => {
                  // Re-use logic for atomic update
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
                background="#f1f5f9"
                className="text-[10px] font-bold uppercase tracking-wider"
              />
            </div>

            {/* Specialty Selection Row */}
            <div className="flex items-center gap-4 mt-2">
              <FilterSelect
                value={specialty}
                onChange={(v) => updateFilters(division, v)}
                options={filteredSpecialties.map((s) => ({ value: s.code, label: s.code }))}
                padding="6px 16px"
                className="text-2xl sm:text-3xl font-extrabold"
              />
              <span className="text-2xl sm:text-3xl font-bold text-slate-400 tracking-tight">
                {activeSpecialtyNameOnly}
              </span>
            </div>
          </div>
        </div>

        {/* --- 12 KPI Cards Grid (Clean Layout) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {mockDataStats.kpis.map((kpi) => {
            const isPositive = kpi.diff > 0;
            const isGood = kpi.inverted ? !isPositive : isPositive;
            const DiffIcon = isPositive ? TrendingUp : TrendingDown;

            const badgeClasses =
              kpi.diff === 0
                ? "text-slate-500 bg-slate-100"
                : isGood
                ? "text-emerald-700 bg-emerald-50 border border-emerald-100/50"
                : "text-rose-700 bg-rose-50 border border-rose-100/50";

            return (
              <div
                key={kpi.id}
                className="bg-white p-5 rounded-[1.5rem] border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between h-56 group"
              >
                <div>
                  <div className="flex justify-between items-start mb-1 h-8">
                    {/* Header with Title and Tooltip */}
                    <div className="flex items-center gap-1.5 relative group/tooltip">
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-tight">
                        {removeGreekAccents(kpi.title).toUpperCase()}
                      </div>
                      <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help transition-colors" />

                      {/* Tooltip Content */}
                      <div className="absolute left-0 top-6 hidden group-hover/tooltip:block w-64 bg-slate-800 text-left p-3.5 rounded-xl shadow-xl z-50 pointer-events-none">
                        <div className="mb-2">
                          <span className="text-[10px] font-extrabold text-sky-400 uppercase tracking-widest block mb-1">
                            ΤΙ ΕΙΝΑΙ
                          </span>
                          <span className="text-xs text-slate-200 leading-snug">
                            {kpi.infoWhat}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                            ΓΙΑΤΙ ΕΙΝΑΙ ΣΗΜΑΝΤΙΚΟ
                          </span>
                          <span className="text-xs text-slate-200 leading-snug">
                            {kpi.infoWhy}
                          </span>
                        </div>
                        <div className="absolute -top-1 left-4 w-2.5 h-2.5 bg-slate-800 transform rotate-45"></div>
                      </div>
                    </div>

                    {/* Semantic Diff Badge */}
                    {kpi.diff !== 0 && (
                      <div
                        className={`text-[10px] whitespace-nowrap font-bold px-2 py-0.5 rounded-md flex items-center h-fit ${badgeClasses}`}
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

                  {/* Clean Number Value */}
                  <div className="text-3xl mt-1 font-extrabold tracking-tight text-slate-800">
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
                          fill: "#64748b",
                          fontWeight: 500,
                        }}
                        dy={5}
                      />
                      <RechartsTooltip
                        cursor={{ fill: "#f8fafc" }}
                        contentStyle={{ display: "none" }}
                      />
                      <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                        <LabelList
                          dataKey="val"
                          position="top"
                          formatter={(value: number) =>
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
          <div className="bg-white border border-slate-200/60 shadow-sm p-6 sm:p-8 rounded-[2rem] flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1">
                  Σύγκριση Μορίων & Βάσεων
                </h3>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  {removeGreekAccents(
                    "Πού κυμαίνεται η βάση σε σχέση με τη μάζα"
                  ).toUpperCase()}
                </p>
              </div>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-sky-700"></div> ΒΑΣΗ
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-slate-200"></div>{" "}
                  ΑΙΤΟΥΝΤΕΣ
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-[220px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockDataStats.charts.comparison}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="base"
                    fill="#0369a1"
                    radius={[4, 4, 0, 0]}
                    name="Βάση"
                  />
                  <Bar
                    dataKey="avgApp"
                    fill="#e2e8f0"
                    radius={[4, 4, 0, 0]}
                    name="Μ.Ο. Αιτούντων"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 shadow-sm p-6 sm:p-8 rounded-[2rem] flex flex-col justify-center items-center text-center">
            <Activity className="w-12 h-12 text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Στρατηγική Ανάλυση
            </h3>
            <p className="text-sm text-slate-500 max-w-sm">
              Γράφημα κατανομής: Πόσοι αιτούντες βρίσκονται πάνω ή κάτω από τη
              φετινή βάση.
            </p>
          </div>
        </div>

        {/* --- Rankings Area (Top 5) --- */}
        <div className="bg-white border border-slate-200/60 shadow-sm p-6 sm:p-8 rounded-[2rem]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                  <Map className="w-5 h-5" />
                </div>
                Γεωγραφική Ανάλυση Ειδικότητας
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-2 pl-12">
                Ποιες περιοχές απορρόφησαν τον κόσμο & ποιες απαιτούν τα
                περισσότερα μόρια.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* List 1: Top Destinations */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">
                13. ΚΟΡΥΦΑΙΟΙ ΠΡΟΟΡΙΣΜΟΙ ΑΠΟΡΡΟΦΗΣΗΣ
              </h4>
              <div className="space-y-6">
                {mockDataStats.topDestinations.map((item, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-700 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md shadow-sm">
                        {item.val} θέσεις
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-sky-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(item.val / item.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List 2: Top Competitive */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">
                14. ΠΕΡΙΟΧΕΣ ΜΕ ΤΙΣ ΥΨΗΛΟΤΕΡΕΣ ΒΑΣΕΙΣ
              </h4>
              <div className="space-y-6">
                {mockDataStats.topCompetitive.map((item, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-700 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md shadow-sm">
                        {item.val} μόρια
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-sky-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(item.val / item.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
