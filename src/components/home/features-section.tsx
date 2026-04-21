"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    title: "Έξυπνο Matching",
    description:
      "Ο αλγόριθμος αναζητά άμεσα αμοιβαίες μεταθέσεις (Direct Matches) με βάση την ειδικότητα και τις προτιμήσεις σας.",
  },
  {
    id: 3,
    title: "Άμεση Επικοινωνία",
    description:
      "Μόλις βρεθεί ταίριασμα, ανοίγει αυτόματα ένα ασφαλές κανάλι επικοινωνίας για να συντονίσετε τις λεπτομέρειες της μετάθεσης.",
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
      className="py-16 lg:py-24 bg-white overflow-hidden min-h-screen flex items-center"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          `,
        }}
      />
      <div className="max-w-[1280px] w-full mx-auto px-6">
        <div className="mb-16 text-center">
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Πώς λειτουργεί</h4>
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl text-balance">Απλοποιήστε τη διαδικασία μετάθεσής σας</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">Τρία απλά βήματα για να βρείτε την επόμενη επαγγελματική σας στέγη χωρίς περιττές καθυστερήσεις.</p>
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
                        className="absolute top-0 left-0 w-full bg-[#0369a1]"
                        style={{ height: `${progress}%` }}
                      />
                    )}
                  </div>
                  <div className="py-4">
                    <h3
                      className={`text-[26px] leading-[1.2] font-bold transition-colors duration-200 ${
                        isActive
                          ? "text-[#1d1c1d]"
                          : "text-[#616061] group-hover:text-[#1d1c1d]"
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
                            <p className="text-[18px] leading-relaxed text-[#454245]">
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
              className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-white to-transparent"
              style={{ width: sideFadeWidth }}
            />
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-white to-transparent"
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
                          className="absolute top-0 left-0 h-full bg-[#0369a1]"
                          style={{ width: `${progress}%` }}
                        />
                      )}
                    </div>
                    <h3
                      className={`text-[22px] leading-[1.2] font-bold transition-colors duration-200 mb-3 ${
                        isActive ? "text-[#1d1c1d]" : "text-[#616061]"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`text-[16px] leading-relaxed transition-opacity duration-300 ${
                        isActive
                          ? "text-[#454245] opacity-100"
                          : "text-[#454245] opacity-50"
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
              <div className="w-full rounded-[2rem] shadow-2xl border border-gray-200/80 overflow-hidden bg-white flex flex-col h-full">
                {/* Mac Header */}
                <div className="bg-[#f3f3f3] px-3 py-2 flex items-center justify-between border-b border-gray-200/80 flex-shrink-0">
                  <div className="flex space-x-1.5 w-16">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-white/80 border border-gray-200/50 rounded h-6 w-3/4 max-w-[240px] flex items-center justify-center text-[10px] text-gray-400 font-medium">
                      metathesi.gr
                    </div>
                  </div>
                  <div className="w-16"></div>
                </div>

                {/* Window Content */}
                <div className="w-full h-full relative bg-[#f8fafc] pointer-events-none select-none overflow-hidden">
                  <WizardStep1 />
                </div>
              </div>
            ) : (
              <div className="w-full h-full rounded-[2rem] bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-gray-400 font-medium text-lg">
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
        ? "ring-2 ring-[#0369a1] bg-sky-50 shadow-[0_0_15px_rgba(3,105,161,0.15)] scale-[1.02] z-10"
        : "bg-slate-50 border border-slate-200"
    }`
  }

  return (
    <motion.div
      ref={scrollContainerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // Βάλαμε το overflow και την κρυφή μπάρα κύλισης απευθείας σε αυτό το div
      className="h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] text-slate-900 antialiased pb-6 pt-4 relative"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* SECTION 1: IDENTITY */}
        <div className="bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(3,105,161,0.05)] p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-sky-50 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-[13px] sm:text-[14px] font-bold text-slate-800 tracking-tight flex items-center gap-2 mb-4 sm:mb-5 relative z-10">
            <div className="p-1.5 rounded-lg bg-sky-50 text-[#0369A1]">
              <span className="material-symbols-outlined text-[16px]">
                account_circle
              </span>
            </div>
            Επαγγελματική Ταυτότητα & Τρέχουσα Θέση
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 relative z-10">
            {/* ΟΝΟΜΑ */}
            <div className="md:col-span-2">
              <label className="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                ΟΝΟΜΑ
              </label>
              <div className={getFieldClasses(0)}>
                <span
                  className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[15px] transition-colors ${
                    sequenceStep === 0 ? "text-[#0369A1]" : "text-slate-400"
                  }`}
                >
                  person
                </span>
                <input
                  type="text"
                  value={typedName}
                  placeholder="Πληκτρολογήστε όνομα..."
                  className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-transparent rounded-xl text-[10px] sm:text-[11px] font-medium outline-none text-slate-900"
                  readOnly
                  tabIndex={-1}
                />
                {sequenceStep === 0 && typedName !== targetName && (
                  <span className="absolute left-9 top-1/2 -translate-y-1/2 w-[2px] h-3 bg-[#0369a1] animate-pulse ml-[attr(value) length]"></span>
                )}
              </div>
            </div>

            {/* ΒΑΘΜΙΔΑ */}
            <div>
              <label className="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                ΒΑΘΜΙΔΑ
              </label>
              <div className={getFieldClasses(1)}>
                <span
                  className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[15px] transition-colors ${
                    sequenceStep === 1 ? "text-[#0369A1]" : "text-slate-400"
                  }`}
                >
                  layers
                </span>
                <select
                  tabIndex={-1}
                  className={`w-full pl-9 pr-3 py-2 sm:py-2.5 bg-transparent rounded-xl text-[10px] sm:text-[11px] font-medium outline-none appearance-none transition-colors ${
                    sequenceStep >= 1 ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  <option>
                    {sequenceStep >= 1
                      ? "Δευτεροβάθμια Γενικής"
                      : "Επίλεξε Βαθμίδα"}
                  </option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* ΕΙΔΙΚΟΤΗΤΑ */}
            <div>
              <label className="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                ΕΙΔΙΚΟΤΗΤΑ
              </label>
              <div className={`flex overflow-hidden ${getFieldClasses(2)}`}>
                <div className="relative w-16 border-r border-slate-200/60">
                  <select
                    tabIndex={-1}
                    className={`w-full h-full pl-2 pr-5 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-bold bg-transparent appearance-none transition-colors ${
                      sequenceStep >= 2 ? "text-slate-700" : "text-slate-400"
                    }`}
                  >
                    <option>{sequenceStep >= 2 ? "ΠΕ" : "-"}</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-1 top-1/2 -translate-y-1/2 text-[14px] text-slate-400 pointer-events-none">
                    expand_more
                  </span>
                </div>
                <div className="relative flex-grow">
                  <select
                    tabIndex={-1}
                    className={`w-full h-full pl-3 pr-8 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-medium bg-transparent appearance-none transition-colors ${
                      sequenceStep >= 2 ? "text-slate-700" : "text-slate-400"
                    }`}
                  >
                    <option>
                      {sequenceStep >= 2
                        ? "02 - Φιλόλογος"
                        : "Επίλεξε Ειδικότητα"}
                    </option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 border-t border-slate-100 my-0.5 sm:my-1"></div>

            {/* ΠΕΡΙΦΕΡΕΙΑ */}
            <div>
              <label className="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                ΠΕΡΙΦΕΡΕΙΑ
              </label>
              <div className={getFieldClasses(3)}>
                <select
                  tabIndex={-1}
                  className={`w-full pl-3 pr-8 py-2 sm:py-2.5 bg-transparent rounded-xl text-[10px] sm:text-[11px] font-medium outline-none appearance-none transition-colors ${
                    sequenceStep >= 3 ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  <option>
                    {sequenceStep >= 3 ? "Αττική" : "Επίλεξε Περιφέρεια"}
                  </option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* ΠΕΡΙΟΧΗ */}
            <div>
              <label className="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                ΠΕΡΙΟΧΗ
              </label>
              <div className={getFieldClasses(4)}>
                <select
                  tabIndex={-1}
                  className={`w-full pl-3 pr-8 py-2 sm:py-2.5 bg-transparent rounded-xl text-[10px] sm:text-[11px] font-medium outline-none appearance-none transition-colors ${
                    sequenceStep >= 4 ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  <option>
                    {sequenceStep >= 4 ? "Β' Αθήνας" : "Επίλεξε Περιοχή"}
                  </option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400 pointer-events-none">
                  expand_more
                </span>
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
          className="bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(3,105,161,0.05)] p-4 sm:p-5 relative"
        >
          {sequenceStep < 5 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-[1.5rem]">
              <span className="text-xs font-semibold text-slate-400">
                Αναμονή δεδομένων...
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-5">
            <div>
              <h2 className="text-[13px] sm:text-[14px] font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                  <span className="material-symbols-outlined text-[16px]">
                    map
                  </span>
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
              className="bg-white rounded-xl p-1.5 sm:p-2 shadow-sm border border-slate-100 flex items-center justify-between group"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center text-[10px] sm:text-[11px] font-bold">
                  1
                </div>
                <span className="text-[11px] sm:text-[12px] font-semibold text-slate-700">
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
              className="bg-white rounded-xl p-1.5 sm:p-2 shadow-sm border border-slate-100 flex items-center justify-between group"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center text-[10px] sm:text-[11px] font-bold">
                  2
                </div>
                <span className="text-[11px] sm:text-[12px] font-semibold text-slate-700">
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
            className="bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-xl text-[10px] sm:text-[11px] font-semibold w-full sm:w-auto"
          >
            Ακύρωση
          </button>
          <button
            tabIndex={-1}
            className={`px-5 py-2 rounded-xl text-[10px] sm:text-[11px] font-semibold w-full sm:w-auto flex items-center justify-center gap-1.5 transition-all duration-150 relative overflow-hidden ${
              sequenceStep === 6
                ? "bg-[#075985] text-white/90 scale-95 shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)]"
                : "bg-[#0369a1] text-white shadow-[0_4px_10px_-3px_rgba(3,105,161,0.2)] scale-100"
            }`}
          >
            {sequenceStep === 6 && (
              <span className="absolute inset-0 bg-white/20 animate-ping rounded-xl"></span>
            )}
            Υποβολή Αίτησης
            <span className="material-symbols-outlined text-[15px]">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

