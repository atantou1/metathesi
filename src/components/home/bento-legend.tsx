"use client"

import React from "react"

export function BentoLegend() {
  const items = [
    { color: "#0369a1", label: "> 100" },
    { color: "#0284c7", label: "70 - 100" },
    { color: "#0ea5e9", label: "50 - 70" },
    { color: "#38bdf8", label: "35 - 50" },
    { color: "#bae6fd", label: "< 35" },
  ]

  return (
    <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-border/50 dark:border-white/10 rounded-xl p-3 shadow-sm dark:shadow-2xl min-w-[100px]">
        <h4 className="text-[9px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-widest mb-2 opacity-70 dark:opacity-90">
          Βάση Μορίων
        </h4>
        <div className="flex flex-col gap-1.5">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                style={{ background: item.color }}
              />
              <span className="text-[10px] font-semibold text-foreground/80 dark:text-slate-200 whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
