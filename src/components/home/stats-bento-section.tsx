"use client"

import React from "react"

export function StatsBentoSection() {
  return (
    <section className="bg-[#F8FAFC] py-24 px-6 dark:bg-black font-sans">
      <div className="mx-auto max-w-[1200px]">
        {/* Επικεφαλίδα (Solution Section) */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h4 className="mb-4 text-[14px] font-medium uppercase tracking-[0.7px] leading-[20px] text-[#0369a1]">Στατιστικά & Αναλύσεις</h4>
          <h2 className="mb-6 text-[48px] font-semibold tracking-tight text-neutral-900 leading-[48px] dark:text-white">
            Όλα τα δεδομένα για την Ειδικότητά σας
          </h2>
          <p className="mt-[24px] mx-auto text-[18px] leading-[32px] text-slate-500 dark:text-neutral-400 px-0 md:px-[104.5px]">
            Η πλατφόρμα μας σας παρέχει ολοκληρωμένη πρόσβαση σε διαδραστικά
            στατιστικά, αναλύσεις ζήτησης και ιστορικά δεδομένα μεταθέσεων.
          </p>
        </div>

        {/* Το Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[22rem]">
          {/* BOX 1: Advanced Algorithms */}
          <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-[#f9f9f9] transition-all duration-500 hover:bg-sky-50/50 dark:border-neutral-800 dark:bg-neutral-900 hover:dark:bg-sky-900/20 md:col-start-1 md:row-start-1 lg:col-start-1 lg:row-start-1">
            <div className="relative z-10 flex flex-col items-start p-6">
              <h3 className="text-[1.1rem] font-semibold text-neutral-900 dark:text-white">
                Ανάλυση Δημοτικότητας
              </h3>
              <p className="mt-1 text-[0.95rem] text-slate-500 dark:text-neutral-400 leading-6">
                Δείτε σε πραγματικό χρόνο την ζήτηση (1η προτίμηση) για τις περιοχές που σας ενδιαφέρουν.
              </p>
            </div>
            <div className="absolute inset-x-6 bottom-0 top-32 rounded-t-xl border border-neutral-200/60 bg-white shadow-xl transition-transform duration-500 group-hover:-translate-y-2 dark:border-neutral-700 dark:bg-neutral-950">
              <div className="flex h-8 items-center gap-1.5 border-b border-neutral-100 bg-neutral-50/50 px-3 dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="flex h-full items-center justify-center p-4 pb-12 text-center text-sm text-neutral-300 dark:text-neutral-700">
                [ Heatmap Overview ]
              </div>
            </div>
          </div>

          {/* BOX 2: Seamless Integration */}
          <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-[#f9f9f9] transition-all duration-500 hover:bg-teal-50/50 dark:border-neutral-800 dark:bg-neutral-900 hover:dark:bg-teal-900/20 md:col-start-1 md:row-start-2 lg:col-start-2 lg:row-start-1">
            <div className="relative z-10 flex flex-col items-start p-6">
              <h3 className="text-[1.1rem] font-semibold text-neutral-900 dark:text-white">
                Ιστορικό Βάσεων
              </h3>
              <p className="mt-1 text-[0.95rem] text-slate-500 dark:text-neutral-400 leading-6">
                Συγκρίνετε τα μόρια των βάσεων για τα τελευταία έτη (2022-2024).
              </p>
            </div>
            <div className="absolute inset-x-6 bottom-[-20px] top-32 flex flex-col gap-2.5 transition-transform duration-500 group-hover:-translate-y-2">
              <div className="h-12 w-full rounded-lg border border-neutral-200/60 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 flex items-center justify-between px-3 text-xs text-neutral-400">
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded bg-teal-100 mr-2 dark:bg-teal-800/30"></div> 2024
                </div>
                <span className="font-mono text-teal-600">64.53 μ.</span>
              </div>
              <div className="h-12 w-full rounded-lg border border-neutral-200/60 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 flex items-center justify-between px-3 text-xs text-neutral-400">
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded bg-neutral-100 mr-2 dark:bg-neutral-800"></div> 2023
                </div>
                <span className="font-mono text-neutral-500">62.11 μ.</span>
              </div>
            </div>
          </div>

          {/* BOX 3: Secure Data Handling (Το ΨΗΛΟ κουτί) */}
          <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-[#f9f9f9] transition-all duration-500 hover:bg-emerald-50/50 dark:border-neutral-800 dark:bg-neutral-900 hover:dark:bg-emerald-900/20 md:col-start-2 md:row-start-1 md:row-span-2 lg:col-start-3 lg:row-start-1 lg:row-span-2">
            <div className="relative z-10 flex flex-col items-start p-6">
              <h3 className="text-[1.1rem] font-semibold text-neutral-900 dark:text-white">
                Έγκυρα & Ασφαλή Δεδομένα
              </h3>
              <p className="mt-1 text-[0.95rem] text-slate-500 dark:text-neutral-400 leading-6">
                Επεξεργαζόμαστε τα επίσημα στοιχεία του Υπουργείου για να σας προσφέρουμε την πιο σαφή εικόνα της ζήτησης.
              </p>
            </div>
            <div className="absolute inset-x-6 bottom-0 top-36 rounded-t-2xl border-x-2 border-t-2 border-neutral-800 bg-white shadow-xl transition-transform duration-500 group-hover:-translate-y-2 dark:border-neutral-600 dark:bg-black">
              <div className="flex flex-col gap-3 p-4 w-full">
                <div className="h-12 w-full rounded-lg border border-neutral-200/60 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900 flex items-center justify-center text-xs text-neutral-400">
                  <span className="material-symbols-outlined text-[16px] mr-1.5">verified</span> Επίσημες Πηγές
                </div>
                <div className="h-12 w-full rounded-lg border border-neutral-200/60 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900 flex items-center justify-center text-xs text-neutral-400">
                  <span className="material-symbols-outlined text-[16px] mr-1.5">update</span> Ετήσια Ενημέρωση
                </div>
                <div className="h-12 w-full rounded-lg border border-neutral-200/60 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900 flex items-center justify-center text-xs text-neutral-400">
                  <span className="material-symbols-outlined text-[16px] mr-1.5">analytics</span> 150+ Περιοχές
                </div>
                <div className="h-12 w-full rounded-lg border border-neutral-200/60 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900 flex items-center justify-center text-xs text-neutral-400">
                  <span className="material-symbols-outlined text-[16px] mr-1.5">group</span> 40+ Ειδικότητες
                </div>
              </div>
            </div>
          </div>

          {/* BOX 4: Customizable Solutions (Το ΦΑΡΔΥ κουτί) */}
          <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-[#f9f9f9] transition-all duration-500 hover:bg-slate-100 dark:border-neutral-800 dark:bg-neutral-900 hover:dark:bg-slate-800/50 md:col-start-1 md:col-span-2 md:row-start-3 lg:col-start-1 lg:col-span-2 lg:row-start-2">
            <div className="relative z-10 flex flex-col items-start p-6 w-full md:w-1/2 lg:w-2/3">
              <h3 className="text-[1.1rem] font-semibold text-neutral-900 dark:text-white">
                Διαδραστικά Γραφήματα & Πίνακες
              </h3>
              <p className="mt-1 text-[0.95rem] text-slate-500 dark:text-neutral-400 leading-6 max-w-sm">
                Εξερευνήστε δυναμικά την ανάλυση κενών και ικανοποίησης (Branch Satisfaction) με σύγχρονα Data Workflows.
              </p>
            </div>
            <div className="absolute inset-x-6 md:left-[45%] lg:left-[50%] bottom-0 top-36 md:top-6 flex overflow-hidden rounded-t-xl md:rounded-tl-xl md:rounded-tr-none border border-neutral-200/60 bg-white shadow-xl transition-transform duration-500 group-hover:-translate-y-2 md:group-hover:-translate-x-2 md:group-hover:translate-y-0 dark:border-neutral-700 dark:bg-neutral-950">
              <div className="hidden sm:block w-1/3 border-r border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/30">
                <div className="h-2 w-3/4 rounded bg-neutral-200 mb-3 dark:bg-neutral-800"></div>
                <div className="h-2 w-full rounded bg-neutral-200 mb-2 dark:bg-neutral-800"></div>
                <div className="h-2 w-5/6 rounded bg-neutral-200 mb-2 dark:bg-neutral-800"></div>
              </div>
              <div className="flex-1 p-4 flex items-center justify-center text-center text-xs text-neutral-400">
                [ Interactive Charts View ]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
