"use client"

import { BentoMap } from "./bento-map"
import { BentoLegend } from "./bento-legend"

import { BentoStatsGrid } from "./bento-stats-grid"

import { BentoInteractiveCharts } from "./bento-interactive-charts"

export function StatsBentoSection() {
  return (
    <section className="bg-background py-24 px-6">
      <div className="mx-auto max-w-[1200px]">
        {/* Επικεφαλίδα (Solution Section) */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h4 className="mb-4 text-[14px] font-medium uppercase tracking-[0.7px] leading-[20px] text-primary">Στατιστικά & Αναλύσεις</h4>
          <h2 className="mb-6 text-[32px] md:text-[48px] font-semibold tracking-tight text-foreground leading-tight md:leading-[48px] dark:text-white">
            Όλα τα δεδομένα για την Ειδικότητά σας
          </h2>
          <p className="mt-[24px] mx-auto text-[18px] leading-[32px] text-muted-foreground px-0 md:px-[104.5px]">
            Η πλατφόρμα μας σας παρέχει ολοκληρωμένη πρόσβαση σε διαδραστικά
            στατιστικά, αναλύσεις ζήτησης και ιστορικά δεδομένα μεταθέσεων.
          </p>
        </div>

        {/* Το Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[22rem]">
          {/* BOX 1: Advanced Algorithms */}
          <div className="group relative overflow-hidden rounded-4xl border border-border bg-card transition-all duration-500 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 md:col-start-1 md:row-start-1 lg:col-start-1 lg:row-start-1">
            <div className="relative z-10 flex flex-col items-start p-6">
              <h3 className="text-[1.1rem] font-semibold text-foreground">
                Ανάλυση Δημοτικότητας
              </h3>
              <p className="mt-1 text-[0.95rem] text-muted-foreground leading-6">
                Δείτε σε πραγματικό χρόνο την ζήτηση (1η προτίμηση) για τις περιοχές που σας ενδιαφέρουν.
              </p>
            </div>
            <div className="absolute inset-x-6 bottom-0 top-32 rounded-t-3xl border border-neutral-200/60 bg-background shadow-xl transition-transform duration-500 group-hover:-translate-y-2 dark:border-border dark:bg-background overflow-hidden flex flex-col">
              <div className="flex h-9 items-center gap-2 border-b border-border bg-muted px-4 rounded-t-3xl">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 p-2 overflow-hidden relative h-[calc(100%-32px)]">
                <BentoStatsGrid variant="popularity" />
              </div>
            </div>
          </div>

          {/* BOX 2: Seamless Integration */}
          <div className="group relative overflow-hidden rounded-4xl border border-border bg-card transition-all duration-500 hover:bg-teal-50/80 dark:hover:bg-teal-950/40 md:col-start-1 md:row-start-2 lg:col-start-2 lg:row-start-1">
            <div className="relative z-10 flex flex-col items-start p-6">
              <h3 className="text-[1.1rem] font-semibold text-foreground">
                Ιστορικό Βάσεων
              </h3>
              <p className="mt-1 text-[0.95rem] text-muted-foreground leading-6">
                Συγκρίνετε τα μόρια των βάσεων για τα τελευταία έτη (2022-2024).
              </p>
            </div>
            <div className="absolute inset-x-6 bottom-0 top-32 rounded-t-3xl border border-neutral-200/60 bg-background shadow-xl transition-transform duration-500 group-hover:-translate-y-2 dark:border-border dark:bg-background overflow-hidden flex flex-col">
              <div className="flex h-9 items-center gap-2 border-b border-border bg-muted px-4 rounded-t-3xl">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 p-2 overflow-hidden relative h-[calc(100%-32px)]">
                <BentoStatsGrid variant="history" />
              </div>
            </div>
          </div>

          {/* BOX 3: Secure Data Handling (Το ΨΗΛΟ κουτί) */}
          <div className="group relative overflow-hidden rounded-4xl border border-border bg-card transition-all duration-500 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 md:col-start-2 md:row-start-1 md:row-span-2 lg:col-start-3 lg:row-start-1 lg:row-span-2">
            <div className="relative z-10 flex flex-col items-start p-6">
              <h3 className="text-[1.1rem] font-semibold text-foreground">
                Έγκυρα & Ασφαλή Δεδομένα
              </h3>
              <p className="mt-1 text-[0.95rem] text-muted-foreground leading-6">
                Επεξεργαζόμαστε τα επίσημα στοιχεία του Υπουργείου για να σας προσφέρουμε την πιο σαφή εικόνα της ζήτησης.
              </p>
            </div>
            <div className="absolute inset-x-6 bottom-0 top-32 rounded-t-3xl border border-neutral-200/60 bg-background shadow-xl transition-transform duration-500 group-hover:-translate-y-2 dark:border-border dark:bg-background overflow-hidden flex flex-col">
              <div className="flex h-9 items-center gap-2 border-b border-border bg-muted px-4 rounded-t-3xl">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 flex items-center justify-center overflow-hidden relative">
                <BentoMap />
                <BentoLegend />
              </div>
            </div>
          </div>

          {/* BOX 4: Customizable Solutions (Το ΦΑΡΔΥ κουτί) */}
          <div className="group relative overflow-hidden rounded-4xl border border-border bg-card transition-all duration-500 hover:bg-amber-50/80 dark:hover:bg-amber-950/30 md:col-start-1 md:col-span-2 md:row-start-3 lg:col-start-1 lg:col-span-2 lg:row-start-2">
            <div className="relative z-10 flex flex-col items-start p-6 w-full md:w-1/2 lg:w-2/3">
              <h3 className="text-[1.1rem] font-semibold text-foreground">
                Διαδραστικά Γραφήματα & Πίνακες
              </h3>
              <p className="mt-1 text-[0.95rem] text-muted-foreground leading-6 max-w-sm">
                Εξερευνήστε δυναμικά την ανάλυση κενών και ικανοποίησης (Branch Satisfaction) με σύγχρονα Data Workflows.
              </p>
            </div>
            <div className="absolute inset-x-6 md:left-[45%] lg:left-[50%] bottom-0 top-36 md:top-6 flex overflow-hidden rounded-t-2xl md:rounded-tl-2xl md:rounded-tr-none border border-neutral-200/60 bg-background shadow-xl transition-transform duration-500 group-hover:-translate-y-2 md:group-hover:-translate-x-2 md:group-hover:translate-y-0 dark:border-border">
              <div className="hidden sm:block w-1/3 border-r border-neutral-100 bg-surface-dim/50 p-4 dark:border-border dark:bg-card/30">
                <div className="h-2 w-3/4 rounded bg-neutral-200 mb-3 dark:bg-muted"></div>
                <div className="h-2 w-full rounded bg-neutral-200 mb-2 dark:bg-muted"></div>
                <div className="h-2 w-5/6 rounded bg-neutral-200 mb-2 dark:bg-muted"></div>
              </div>
              <div className="flex-1 p-2 overflow-hidden relative">
                <BentoInteractiveCharts />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
