"use client"

import React from "react"

export function BentoInteractiveCharts() {
  const comparisonData = [
    { year: "22", base: 45, avg: 30 },
    { year: "23", base: 52, avg: 35 },
    { year: "24", base: 64, avg: 42 },
  ]

  const topDestinations = [
    { name: "ΑΘΗΝΑ", val: 42, max: 42 },
    { name: "ΘΕΣΣΑΛΟΝΙΚΗ", val: 28, max: 42 },
    { name: "ΗΡΑΚΛΕΙΟ", val: 15, max: 42 },
  ]

  return (
    <div className="flex h-full w-full gap-4 p-3 overflow-hidden">
      {/* Comparison Chart Side */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            Σύγκριση Μορίων
          </span>
          <div className="flex gap-2 text-[7px] font-bold uppercase">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> ΒΑΣΗ
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800"></div> Μ.Ο.
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex items-end justify-around gap-2 px-1">
          {comparisonData.map((d, i) => (
            <div key={i} className="flex-1 flex items-end gap-1 h-full max-w-[40px]">
              <div 
                className="flex-1 bg-neutral-200 dark:bg-neutral-800 rounded-t-sm transition-all duration-700"
                style={{ height: `${d.avg}%` }}
              />
              <div 
                className="flex-1 bg-primary rounded-t-sm transition-all duration-700"
                style={{ height: `${d.base}%` }}
              />
              <div className="absolute -bottom-4 left-0 right-0 text-center text-[8px] font-medium text-muted-foreground">
                {d.year}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Destinations Side */}
      <div className="w-[120px] flex flex-col gap-3 border-l border-neutral-100 dark:border-white/5 pl-4">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
          Προορισμοί
        </span>
        <div className="flex flex-col gap-3">
          {topDestinations.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between text-[8px] font-bold text-foreground">
                <span>{item.name}</span>
                <span className="text-muted-foreground">{item.val}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${(item.val / item.max) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
