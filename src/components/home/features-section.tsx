"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Search, Settings, ChevronDown, Send, 
  Paperclip, Smile, MoreVertical, Bell, 
  CheckCircle2, MapPin, Building2, Mail,
  ArrowRight, Sparkles, CheckCheck
} from "lucide-react";

const DURATIONS = [9500, 6000, 6000];

const features = [
  {
    id: 1,
    title: "Δημιουργία Αίτησης",
    description:
      "Εισάγετε την τρέχουσα τοποθέτησή σας και επιλέξτε τις περιοχές που επιθυμείτε να μετατεθείτε. Το σύστημα ελέγχει αυτόματα τη συμβατότητα.",
  },
  {
    id: 2,
    title: "Παρακολούθηση & Matches",
    description:
      "Μετά την υποβολή της αίτησης, αποκτάτε πρόσβαση στο προσωπικό σας Dashboard. Εδώ βλέπετε σε πραγματικό χρόνο την κατάσταση της ζήτησης.",
  },
  {
    id: 3,
    title: "Ασφαλής Επικοινωνία",
    description:
      "Μόλις εντοπιστεί αμοιβαίο ταίριασμα, ανοίγει αυτόματα ένα ιδιωτικό κανάλι επικοινωνίας μεταξύ των δύο εκπαιδευτικών για να κανονίσετε τις λεπτομέρειες.",
  },
];

export function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    setProgress(0);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentDuration = DURATIONS[activeIndex] || 6000;
      const percentage = (elapsed / currentDuration) * 100;

      if (percentage >= 100) {
        setActiveIndex((prev) => (prev + 1) % features.length);
        setProgress(0);
        startTimeRef.current = Date.now();
      } else {
        setProgress(percentage);
      }
    }, 16);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex]);

  const handleManualClick = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const slideWidth = "min(300px, 100%)";
  const xOffset = `calc(50% - (${slideWidth} / 2) - (${activeIndex} * (${slideWidth} + 1rem)))`;
  const sideFadeWidth = "calc(50% - min(150px, 50%))";

  return (
    <section
      className="py-16 lg:py-24 bg-surface overflow-hidden min-h-screen flex items-center"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            @keyframes scanning-pulse {
              0% { box-shadow: 0 0 0 0 rgba(3, 105, 161, 0.3); }
              70% { box-shadow: 0 0 0 8px rgba(3, 105, 161, 0); }
              100% { box-shadow: 0 0 0 0 rgba(3, 105, 161, 0); }
            }
            .scanning-pulse {
              animation: scanning-pulse 3s ease-out infinite;
            }
            .animate-shimmer {
              animation: shimmer 2s infinite;
            }
            .glass-card {
              background: var(--card);
              border: 1px solid var(--border);
              box-shadow: 0 8px 30px -4px rgba(3, 105, 161, 0.05);
            }
          `,
        }}
      />
      <div className="max-w-[1280px] w-full mx-auto px-6">
        <div className="mb-16 text-center">
          <h4 className="mb-4 text-[14px] font-medium uppercase tracking-[0.7px] leading-[20px] text-primary">Πώς λειτουργεί</h4>
          <h2 className="text-[48px] font-semibold text-foreground dark:text-white leading-[48px] text-balance">Απλοποιήστε τη διαδικασία μετάθεσής σας</h2>
          <p className="mt-[24px] mx-auto text-[18px] leading-[32px] text-muted-foreground dark:text-text-tertiary px-0 md:px-[104.5px]">Τρία απλά βήματα για να βρείτε την επόμενη επαγγελματική σας στέγη χωρίς περιττές καθυστερήσεις.</p>
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-16 items-center">
          {/* ================= ΑΡΙΣΤΕΡΗ ΣΤΗΛΗ: Δυναμικά Κείμενα ================= */}
          <div className="hidden lg:flex w-full lg:w-[45%] flex-col space-y-2">
            {features.map((feature, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={feature.id}
                  onClick={() => handleManualClick(index)}
                  className="flex cursor-pointer group"
                >
                  <div className="relative w-[3px] rounded-full bg-gray-200 mr-6 overflow-hidden flex-shrink-0">
                    {isActive && (
                      <div
                        className="absolute top-0 left-0 w-full bg-primary"
                        style={{ height: `${progress}%` }}
                      />
                    )}
                  </div>
                  <div className="py-4">
                    <h3
                      className={`text-[26px] leading-[1.2] font-bold transition-colors duration-200 ${
                        isActive
                          ? "text-foreground dark:text-white"
                          : "text-muted-foreground dark:text-slate-500 group-hover:text-foreground"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 pb-2">
                            <p className="text-[18px] leading-relaxed text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= Mobile Carousel ================= */}
          <div className="relative flex lg:hidden w-full flex-col overflow-hidden pb-4">
            <div
              className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-surface to-transparent"
              style={{ width: sideFadeWidth }}
            />
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-surface to-transparent"
              style={{ width: sideFadeWidth }}
            />
            <motion.div
              className="flex w-full gap-4"
              animate={{ x: xOffset }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {features.map((feature, index) => {
                const isActive = activeIndex === index;
                return (
                  <div
                    key={feature.id}
                    className="flex-shrink-0 cursor-pointer"
                    style={{ width: slideWidth }}
                    onClick={() => handleManualClick(index)}
                  >
                    <div className="relative w-full h-[3px] rounded-full bg-gray-200 mb-5 overflow-hidden">
                      {isActive && (
                        <div
                          className="absolute top-0 left-0 h-full bg-primary"
                          style={{ width: `${progress}%` }}
                        />
                      )}
                    </div>
                    <h3
                      className={`text-[22px] leading-[1.2] font-bold transition-colors duration-200 mb-3 ${
                        isActive ? "text-[#1d1c1d] dark:text-white" : "text-[#616061] dark:text-slate-500"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`text-[16px] leading-relaxed transition-opacity duration-300 ${
                        isActive
                          ? "text-[#454245] dark:text-slate-300 opacity-100"
                          : "text-[#454245] dark:text-slate-300 opacity-50"
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* ================= ΔΕΞΙΑ ΣΤΗΛΗ: Animated Mac Screen & Placeholders ================= */}
          <div className="w-full lg:w-[55%] h-[500px] lg:h-[480px]">
            {activeIndex === 0 ? (
              <div className="w-full rounded-4xl shadow-2xl border border-border overflow-hidden bg-card flex flex-col h-full">
                {/* Mac Header */}
                <div className="bg-muted px-3 py-2 flex items-center justify-between border-b border-border flex-shrink-0">
                  <div className="flex space-x-1.5 w-16">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-background/80 border border-border rounded h-6 w-3/4 max-w-[240px] flex items-center justify-center text-[10px] text-text-quaternary font-medium">
                      metathesi.gr
                    </div>
                  </div>
                  <div className="w-16"></div>
                </div>

                {/* Window Content */}
                <div className="w-full h-full relative bg-background pointer-events-none select-none overflow-hidden">
                  <WizardStep1 />
                </div>
              </div>
            ) : activeIndex === 1 ? (
              <div className="w-full rounded-4xl shadow-2xl border border-border overflow-hidden bg-card flex flex-col h-full">
                {/* Mac Header */}
                <div className="bg-muted px-3 py-2 flex items-center justify-between border-b border-border flex-shrink-0 z-50 relative">
                  <div className="flex space-x-1.5 w-16">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-background/80 border border-border rounded h-6 w-3/4 max-w-[240px] flex items-center justify-center text-[10px] text-text-quaternary font-medium">
                      metathesi.gr/dashboard
                    </div>
                  </div>
                  <div className="w-16"></div>
                </div>

                {/* Window Content */}
                <div className="w-full h-full relative bg-background overflow-hidden">
                  <WizardStep2Updated />
                </div>
              </div>
            ) : activeIndex === 2 ? (
              <div className="w-full rounded-4xl shadow-2xl border border-border overflow-hidden bg-card flex flex-col h-full">
                {/* Mac Header */}
                <div className="bg-muted px-3 py-2 flex items-center justify-between border-b border-border flex-shrink-0 z-50 relative">
                  <div className="flex space-x-1.5 w-16">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-background/80 border border-border rounded h-6 w-3/4 max-w-[240px] flex items-center justify-center text-[10px] text-text-quaternary font-medium">
                      metathesi.gr/messages
                    </div>
                  </div>
                  <div className="w-16"></div>
                </div>

                {/* Window Content */}
                <div className="w-full h-full relative bg-background overflow-hidden">
                  <WizardStep3Updated />
                </div>
              </div>
            ) : (
              <div className="w-full h-full rounded-4xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-700 flex items-center justify-center">
                <span className="text-gray-400 dark:text-slate-500 font-medium text-lg">
                  UI Placeholder - Βήμα {activeIndex + 1}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function WizardStep1() {
  const [typedName, setTypedName] = useState("")
  const [sequenceStep, setSequenceStep] = useState(0)

  // Το νέο ref που θα δείχνει στο εσωτερικό scrollable div
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const targetName = "Κωνσταντίνος Παπαδόπουλος"

  useEffect(() => {
    let isMounted = true

    // Μηδενίζουμε το εσωτερικό scroll με το που φορτώνει, αθόρυβα
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }

    const runSequence = async () => {
      await new Promise((r) => setTimeout(r, 1000))

      for (let i = 0; i <= targetName.length; i++) {
        if (!isMounted) return
        setTypedName(targetName.slice(0, i))
        await new Promise((r) => setTimeout(r, Math.random() * 40 + 30))
      }

      await new Promise((r) => setTimeout(r, 600))
      if (!isMounted) return
      setSequenceStep(1)

      await new Promise((r) => setTimeout(r, 800))
      if (!isMounted) return
      setSequenceStep(2)

      await new Promise((r) => setTimeout(r, 800))
      if (!isMounted) return
      setSequenceStep(3)

      await new Promise((r) => setTimeout(r, 800))
      if (!isMounted) return
      setSequenceStep(4)

      await new Promise((r) => setTimeout(r, 1000))
      if (!isMounted) return
      setSequenceStep(5)

      // Προσομοίωση εσωτερικού scroll ΠΡΟΣ ΤΑ ΚΑΤΩ (απαλό)
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        })
      }

      await new Promise((r) => setTimeout(r, 1200))
      if (!isMounted) return
      setSequenceStep(6)

      await new Promise((r) => setTimeout(r, 250))
      if (!isMounted) return
      setSequenceStep(7)
    }

    runSequence()

    return () => {
      isMounted = false
    }
  }, [])

  const getFieldClasses = (step: number) => {
    const isActive = sequenceStep === step
    return `relative transition-all duration-500 rounded-xl ${
      isActive
        ? "ring-2 ring-primary bg-primary-soft shadow-soft scale-[1.02] z-10"
        : "bg-muted border border-border"
    }`
  }

  return (
    <motion.div
      ref={scrollContainerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // Βάλαμε το overflow και την κρυφή μπάρα κύλισης απευθείας σε αυτό το div
      className="h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] antialiased pb-6 pt-4 relative"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* SECTION 1: IDENTITY */}
        <div className="bg-card border border-border rounded-3xl shadow-[0_4px_20px_-4px_rgba(3,105,161,0.05)] p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-primary-soft rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-[13px] sm:text-[14px] font-bold text-foreground tracking-tight flex items-center gap-2 mb-4 sm:mb-5 relative z-10">
            <div className="p-1.5 rounded-2xl bg-primary-soft text-primary">
                <User className="w-4 h-4" />
            </div>
            Επαγγελματική Ταυτότητα & Τρέχουσα Θέση
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 relative z-10">
            {/* ΟΝΟΜΑ */}
            <div className="md:col-span-2">
              <label className="block text-[8px] sm:text-[9px] font-bold text-text-quaternary uppercase tracking-widest pl-1 mb-1.5">
                ΟΝΟΜΑ
              </label>
              <div className={getFieldClasses(0)}>
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] transition-colors ${
                    sequenceStep === 0 ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <input
                  type="text"
                  value={typedName}
                  placeholder="Πληκτρολογήστε όνομα..."
                  className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-transparent rounded-xl text-[10px] sm:text-[11px] font-medium outline-none text-foreground placeholder:text-text-quaternary"
                  readOnly
                  tabIndex={-1}
                />
                {sequenceStep === 0 && typedName !== targetName && (
                  <span className="absolute left-9 top-1/2 -translate-y-1/2 w-[2px] h-3 bg-primary animate-pulse ml-[attr(value) length]"></span>
                )}
              </div>
            </div>

            {/* ΒΑΘΜΙΔΑ */}
            <div>
              <label className="block text-[8px] sm:text-[9px] font-bold text-text-quaternary uppercase tracking-widest pl-1 mb-1.5">
                ΒΑΘΜΙΔΑ
              </label>
              <div className={getFieldClasses(1)}>
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] transition-colors ${
                    sequenceStep === 1 ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <select
                  tabIndex={-1}
                  className={`w-full pl-9 pr-3 py-2 sm:py-2.5 bg-transparent rounded-xl text-[10px] sm:text-[11px] font-medium outline-none appearance-none transition-colors ${
                    sequenceStep >= 1 ? "text-foreground" : "text-text-quaternary"
                  }`}
                >
                  <option>
                    {sequenceStep >= 1
                      ? "Δευτεροβάθμια Γενικής"
                      : "Επίλεξε Βαθμίδα"}
                  </option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary pointer-events-none" />
              </div>
            </div>

            {/* ΕΙΔΙΚΟΤΗΤΑ */}
            <div>
              <label className="block text-[8px] sm:text-[9px] font-bold text-text-quaternary uppercase tracking-widest pl-1 mb-1.5">
                ΕΙΔΙΚΟΤΗΤΑ
              </label>
              <div className={`flex overflow-hidden ${getFieldClasses(2)}`}>
                <div className="relative w-16 border-r border-border/60">
                  <select
                    tabIndex={-1}
                    className={`w-full h-full pl-2 pr-5 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-bold bg-transparent appearance-none transition-colors ${
                      sequenceStep >= 2 ? "text-foreground" : "text-text-quaternary"
                    }`}
                  >
                    <option>{sequenceStep >= 2 ? "ΠΕ" : "-"}</option>
                  </select>
                  <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-quaternary pointer-events-none" />
                </div>
                <div className="relative flex-grow">
                  <select
                    tabIndex={-1}
                    className={`w-full h-full pl-3 pr-8 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-medium bg-transparent appearance-none transition-colors ${
                      sequenceStep >= 2 ? "text-foreground" : "text-text-quaternary"
                    }`}
                  >
                    <option>
                      {sequenceStep >= 2
                        ? "02 - Φιλόλογος"
                        : "Επίλεξε Ειδικότητα"}
                    </option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 border-t border-border my-0.5 sm:my-1"></div>

            {/* ΠΕΡΙΦΕΡΕΙΑ */}
            <div>
              <label className="block text-[8px] sm:text-[9px] font-bold text-text-quaternary uppercase tracking-widest pl-1 mb-1.5">
                ΠΕΡΙΦΕΡΕΙΑ
              </label>
              <div className={getFieldClasses(3)}>
                <select
                  tabIndex={-1}
                  className={`w-full pl-3 pr-8 py-2 sm:py-2.5 bg-transparent rounded-xl text-[10px] sm:text-[11px] font-medium outline-none appearance-none transition-colors ${
                    sequenceStep >= 3 ? "text-foreground" : "text-text-quaternary"
                  }`}
                >
                  <option>
                    {sequenceStep >= 3 ? "Αττική" : "Επίλεξε Περιφέρεια"}
                  </option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary pointer-events-none" />
              </div>
            </div>

            {/* ΠΕΡΙΟΧΗ */}
            <div>
              <label className="block text-[8px] sm:text-[9px] font-bold text-text-quaternary uppercase tracking-widest pl-1 mb-1.5">
                ΠΕΡΙΟΧΗ
              </label>
              <div className={getFieldClasses(4)}>
                <select
                  tabIndex={-1}
                  className={`w-full pl-3 pr-8 py-2 sm:py-2.5 bg-transparent rounded-xl text-[10px] sm:text-[11px] font-medium outline-none appearance-none transition-colors ${
                    sequenceStep >= 4 ? "text-foreground" : "text-text-quaternary"
                  }`}
                >
                  <option>
                    {sequenceStep >= 4 ? "Β' Αθήνας" : "Επίλεξε Περιοχή"}
                  </option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: LOCATIONS */}
        <motion.div
          animate={{
            opacity: sequenceStep >= 5 ? 1 : 0.4,
            y: sequenceStep >= 5 ? 0 : 10,
          }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-3xl shadow-[0_4px_20px_-4px_rgba(3,105,161,0.05)] p-4 sm:p-5 relative"
        >
          {sequenceStep < 5 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-card/50 backdrop-blur-[1px] rounded-3xl">
              <span className="text-xs font-semibold text-text-quaternary">
                Αναμονή δεδομένων...
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-5">
            <div>
              <h2 className="text-[13px] sm:text-[14px] font-bold text-foreground tracking-tight flex items-center gap-2">
                <div className="p-1.5 rounded-2xl bg-success-soft text-success">
                  <MapPin className="w-4 h-4" />
                </div>
                ΠΕΡΙΟΧΕΣ ΠΡΟΤΙΜΗΣΗΣ
              </h2>
            </div>
          </div>

          <div className="space-y-2 sm:pl-9">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: sequenceStep >= 5 ? 1 : 0,
                x: sequenceStep >= 5 ? 0 : -10,
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-card rounded-xl p-1.5 sm:p-2 shadow-sm border border-border flex items-center justify-between group"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-2xl bg-danger-soft text-danger border border-danger/20 flex items-center justify-center text-[10px] sm:text-[11px] font-bold">
                  1
                </div>
                <span className="text-[11px] sm:text-[12px] font-semibold text-foreground">
                  Α' Αθήνας
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: sequenceStep >= 5 ? 1 : 0,
                x: sequenceStep >= 5 ? 0 : -10,
              }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-card rounded-xl p-1.5 sm:p-2 shadow-sm border border-border flex items-center justify-between group"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-2xl bg-warning-soft text-warning border border-warning/20 flex items-center justify-center text-[10px] sm:text-[11px] font-bold">
                  2
                </div>
                <span className="text-[11px] sm:text-[12px] font-semibold text-foreground">
                  Ανατ. Αττική
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-end pt-3 sm:pt-4 pb-4">
          <button
            tabIndex={-1}
            className="bg-card border border-border text-text-secondary px-5 py-2 rounded-xl text-[10px] sm:text-[11px] font-semibold w-full sm:w-auto"
          >
            Ακύρωση
          </button>
          <button
            tabIndex={-1}
            className={`px-5 py-2 rounded-xl text-[10px] sm:text-[11px] font-semibold w-full sm:w-auto flex items-center justify-center gap-1.5 transition-all duration-150 relative overflow-hidden ${
              sequenceStep === 6
                ? "bg-primary-hover text-white/90 scale-95 shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)]"
                : "bg-primary text-white shadow-soft scale-100"
            }`}
          >
            {sequenceStep === 6 && (
              <span className="absolute inset-0 bg-white/20 animate-ping rounded-xl"></span>
            )}
            Υποβολή Αίτησης
            <ArrowRight className="w-[15px] h-[15px]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function WizardStep2Updated() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-foreground antialiased flex flex-col min-h-full font-sans"
    >
      {/* MATCH BANNER */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-gradient-to-r from-tech-card-start to-primary shadow-sm shadow-primary/10 shrink-0 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center justify-between py-2.5 gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2 w-2 relative flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white dark:bg-primary-bright opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white dark:bg-primary-bright"></span>
                  </span>
                  <p className="text-[12px] font-semibold text-white tracking-wide">
                    <span className="hidden sm:inline">Βρέθηκε ενεργό match! Ένας εκπαιδευτικός πληροί τα κριτήριά σας.</span>
                    <span className="inline sm:hidden">Βρέθηκε μια αντιστοίχιση</span>
                  </p>
                </div>
                <button className="w-full sm:w-auto text-[11px] font-bold text-primary dark:text-primary-foreground bg-white dark:bg-primary hover:bg-white/90 dark:hover:bg-primary/90 px-4 py-1.5 rounded-full transition-all shadow-sm active:scale-95">
                  Προβολή →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN AREA */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-grow">
        <div className="grid grid-cols-1 gap-6">
          {/* Main Dashboard */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-4xl glass-card">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="p-5 sm:p-7 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2.5">
                      Αίτηση Αμοιβαίας
                    </h2>
                    <p className="text-xs text-text-tertiary mt-1.5">
                      Υποβλήθηκε στις{" "}
                      <span className="text-foreground font-medium">
                        1 Απρ 2026
                      </span>
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 animate-pulse"></span>
                    Ενεργή
                  </span>
                </div>

                {/* Scanning Animation */}
                <div className="scanning-pulse relative overflow-hidden rounded-3xl bg-gradient-to-br from-tech-card-start to-tech-card-end border border-tech-card-border shadow-xl shadow-primary/10 mb-6">
                  <div
                    className="absolute inset-0 opacity-10 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        "url('https://www.transparenttextures.com/patterns/cubes.png')",
                    }}
                  ></div>
                  <div className="relative p-5 sm:p-6 flex flex-col md:flex-row items-center md:items-start gap-5">
                    <div className="flex-shrink-0 relative">
                      <div className="w-16 h-16 relative flex items-center justify-center">
                        <span
                          className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-20 animate-ping"
                          style={{ animationDuration: "3s" }}
                        ></span>
                        <div className="relative w-12 h-12 rounded-full bg-background border border-primary/50 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="animate-pulse"
                          >
                            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4" />
                            <circle cx="12" cy="12" r="2" />
                            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4" />
                            <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow w-full pt-0.5 text-center md:text-left">
                      <div className="flex justify-between items-start mb-2.5">
                        <h3 className="text-sm font-semibold text-white">
                          Σάρωση για Αμοιβαίες...
                        </h3>
                        <span className="text-[9px] font-bold text-primary-foreground bg-primary/40 px-2 py-0.5 rounded-2xl border border-primary/50">
                          REALTIME
                        </span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-1.5 mb-2 overflow-hidden border border-border/20">
                        <div className="bg-gradient-to-r from-primary/80 via-primary to-primary-bright h-full rounded-full w-3/4 animate-shimmer"></div>
                      </div>
                      <p className="text-text-tertiary text-[11px]">
                        Φάση: Ανάλυση Περιοχών
                      </p>
                    </div>
                  </div>
                </div>

                {/* My Preferences */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-foreground mb-3 tracking-wide">
                    Οι Προτιμήσεις μου
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center p-2.5 rounded-xl bg-background border border-border shadow-sm">
                      <div className="w-7 h-7 rounded-2xl bg-muted border border-border text-text-tertiary flex items-center justify-center text-[10px] font-bold mr-2.5">
                        1
                      </div>
                      <div className="flex-grow flex justify-between items-center text-xs font-medium text-foreground">
                        <span>Β' Αθήνας</span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-danger-soft text-danger border border-danger/20 uppercase">
                          ΜΕΓΙΣΤΗ
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center p-2.5 rounded-xl bg-background border border-border shadow-sm">
                      <div className="w-7 h-7 rounded-2xl bg-muted border border-border text-text-tertiary flex items-center justify-center text-[10px] font-bold mr-2.5">
                        2
                      </div>
                      <div className="flex-grow flex justify-between items-center text-xs font-medium text-foreground">
                        <span>Ανατ. Αττική</span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-warning-soft text-warning border border-warning/20 uppercase">
                          ΥΨΗΛΗ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 border-t border-border pt-5">
                  <button className="flex-1 sm:flex-none bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-soft active:scale-95">
                    Επεξεργασία
                  </button>
                  <button className="flex-1 sm:flex-none bg-danger-soft border border-danger/20 hover:bg-danger/20 text-danger px-6 py-2.5 rounded-xl text-xs font-medium transition-colors">
                    Διαγραφή
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

function WizardStep3Updated() {
  const [msgCount, setMsgCount] = useState(0)
  const [isMariosTyping, setIsMariosTyping] = useState(false)

  useEffect(() => {
    let isMounted = true

    const runSequence = async () => {
      // 1. Αρχική παύση πριν ξεκινήσει η επικοινωνία
      await new Promise((r) => setTimeout(r, 1000))
      if (!isMounted) return

      // 2. Ο Μάριος πληκτρολογεί το 1ο μήνυμα
      setIsMariosTyping(true)
      await new Promise((r) => setTimeout(r, 1500))
      if (!isMounted) return

      // 3. Εμφάνιση 1ου μηνύματος
      setIsMariosTyping(false)
      setMsgCount(1)

      // 4. Παύση μέχρι να "απαντήσουμε" εμείς
      await new Promise((r) => setTimeout(r, 1800))
      if (!isMounted) return

      // 5. Εμφάνιση δικής μας απάντησης (2ο μήνυμα) και τέλος animation
      setMsgCount(2)
    }

    runSequence()

    return () => {
      isMounted = false
    }
  }, [])

  // Animation variants για απαλή εμφάνιση μηνυμάτων (slide up)
  const messageVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 260, damping: 20 },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-foreground antialiased flex h-full w-full bg-background relative overflow-hidden font-sans pointer-events-none select-none"
    >
      {/* SIDEBAR - Κρυμμένο στα κινητά, ορατό από sm και πάνω */}
      <aside className="hidden sm:flex w-[180px] md:w-[220px] bg-background border-r border-border flex-col flex-shrink-0 z-10 h-full">
        <div className="p-3 border-b border-border bg-muted/50 flex-shrink-0">
          <div className="relative flex justify-center mx-auto p-1 bg-muted/50 backdrop-blur-sm rounded-full w-full">
            <div className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-background rounded-full shadow-sm z-0"></div>
            <button className="relative z-10 py-1.5 rounded-full font-bold text-[11px] w-1/2 text-foreground">
              Ενεργές (1)
            </button>
            <button className="relative z-10 py-1.5 rounded-full font-bold text-[11px] w-1/2 text-text-tertiary">
              Ιστορικό (4)
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-2 space-y-2 bg-muted/30">
          <div className="group p-2.5 rounded-xl cursor-pointer transition-all border bg-primary-soft border-primary/20">
            <div className="flex gap-2.5 items-center">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-bold bg-warning-soft border border-warning/20 text-warning">
                  ΜΣ
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-2 border-background rounded-full bg-success"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="text-[12px] font-bold truncate text-primary">
                    Μάριος Σ.
                  </h4>
                  <span className="text-[9px] font-bold text-primary">
                    Σήμερα
                  </span>
                </div>
                <span className="text-[9px] font-medium text-text-tertiary block mb-1 truncate">
                  Α' Θεσσαλονίκης
                </span>
                <div className="flex gap-1.5">
                  <span className="text-[8px] font-bold bg-card text-primary px-1.5 py-0.5 rounded border border-primary/20 shadow-soft">
                    1η Επιλογή
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="group p-2.5 rounded-xl cursor-pointer transition-all border bg-background border-border opacity-80">
            <div className="flex gap-2.5 items-center">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-bold bg-muted border border-border text-text-tertiary">
                  ΕΠ
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="text-[12px] font-bold truncate text-foreground">
                    Ελένη Π.
                  </h4>
                  <span className="text-[9px] font-bold text-text-quaternary">
                    12 Απρ
                  </span>
                </div>
                <span className="text-[9px] font-medium text-text-tertiary block mb-1 truncate">
                  Χανιά
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* CHAT AREA */}
      <main className="flex-1 flex flex-col relative h-full bg-muted/50">
        <header className="h-14 sm:h-16 px-4 border-b border-border bg-background flex items-center justify-between flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold bg-warning-soft border border-warning/20 text-warning">
                ΜΣ
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-background rounded-full bg-success"></div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground tracking-tight leading-tight">
                Μάριος Στεργίου
              </h3>
              <p className="text-[10px] font-medium text-text-tertiary flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                Α' Θεσσαλονίκης
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-2xl text-[9px] font-bold bg-success-soft text-success border border-success/20 uppercase">
              Ενεργό Match
            </span>
            <button className="text-text-quaternary p-1.5 rounded-2xl">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5 relative flex flex-col">
          <div className="flex justify-center mb-2">
            <div className="bg-primary-soft border border-primary/20 text-primary text-[10px] font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-soft">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Το σύστημα εντόπισε αντιστοιχία στις 21 Απρ 2026
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <span className="text-[9px] font-bold text-text-quaternary uppercase tracking-widest bg-card border border-border px-2.5 py-0.5 rounded-full shadow-sm">
              Σήμερα
            </span>
          </div>

          <AnimatePresence>
            {/* 1o Μήνυμα (Received) */}
            {msgCount >= 1 && (
              <motion.div
                key="msg-1"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                className="flex items-end gap-2 max-w-[85%]"
              >
                <div className="hidden sm:flex w-6 h-6 rounded-full flex-shrink-0 border border-border shadow-sm font-bold items-center justify-center text-[8px] text-warning bg-background">
                  ΜΣ
                </div>
                <div className="flex flex-col gap-1">
                  <div className="bg-background px-3.5 py-2.5 rounded-2xl rounded-bl-sm shadow-sm border border-border text-foreground text-[12px] leading-relaxed">
                    Καλησπέρα! Είδα ότι έχουμε ταίριασμα για τις περιοχές μας.
                    Με ενδιαφέρει πολύ η Αθήνα.
                  </div>
                  <span className="text-[9px] font-medium text-text-quaternary ml-1">
                    14:20
                  </span>
                </div>
              </motion.div>
            )}

            {/* 2o Μήνυμα (Sent) */}
            {msgCount >= 2 && (
              <motion.div
                key="msg-2"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                className="flex items-end gap-2 max-w-[85%] ml-auto flex-row-reverse"
              >
                <div className="flex flex-col gap-1 items-end">
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-br-sm text-[12px] bg-primary text-white shadow-soft leading-relaxed">
                    Γεια σας! Ναι, κι εγώ το είδα. Η θέση μου είναι σε κεντρικό
                    σχολείο στη Β' Αθηνας, σας εξυπηρετεί;
                  </div>
                  <div className="flex items-center gap-1 mr-1">
                    <span className="text-[9px] font-medium text-text-quaternary">
                      14:25
                    </span>
                    <CheckCheck className="w-3 h-3 text-primary" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Ένδειξη Πληκτρολόγησης */}
            {isMariosTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5, transition: { duration: 0.2 } }}
                className="flex items-center gap-1.5 text-text-quaternary text-[10px] font-medium italic ml-9 mt-2 absolute bottom-2"
              >
                <span className="flex gap-0.5">
                  <span
                    className="w-1 h-1 bg-text-quaternary rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-1 h-1 bg-text-quaternary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-1 h-1 bg-text-quaternary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </span>
                Ο Μάριος πληκτρολογεί...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <footer className="p-3 sm:p-4 bg-background border-t border-border z-10 flex-shrink-0">
          <div className="flex items-end gap-2">
            <button className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-text-quaternary rounded-2xl">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <textarea
                readOnly
                className="w-full bg-muted border border-border rounded-xl py-2.5 px-3.5 text-xs outline-none resize-none text-foreground cursor-default"
                placeholder="Γράψτε ένα μήνυμα..."
                rows={1}
              ></textarea>
            </div>
            <button className="w-10 h-10 flex-shrink-0 bg-primary text-white rounded-2xl flex items-center justify-center shadow-floating">
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </footer>
      </main>
    </motion.div>
  );
}
