"use client"

import React from "react"

interface MiniChartProps {
  title: string
  value: string
  percent?: string
  bars: number[]
  isPositive?: boolean
}

function MiniChart({ title, value, percent, bars, isPositive }: MiniChartProps) {
  return (
    <div className="flex flex-col gap-1 p-2 h-full bg-card border border-border rounded-xl shadow-soft">
      <div className="flex justify-between items-start">
        <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">
          {title}
        </span>
      </div>
      <div className="text-xs font-extrabold text-foreground flex items-baseline gap-0.5">
        {value}
        {percent && <span className="text-[8px] opacity-70">{percent}</span>}
      </div>
      
      {/* Mini CSS Bars */}
      <div className="flex items-end gap-0.5 h-6 mt-auto w-full">
        {bars.map((height, i) => (
          <div
            key={i}
            className={`flex-1 rounded-[1px] transition-all duration-500 ${
              i === bars.length - 1 
                ? "bg-primary" 
                : "bg-border-strong"
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  )
}

interface BentoStatsGridProps {
  variant?: "popularity" | "history"
}

export function BentoStatsGrid({ variant = "popularity" }: BentoStatsGridProps) {
  if (variant === "history") {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-3 w-full h-full p-2">
        <MiniChart
          title="Αριθμός Μεταθέσεων"
          value="1.240"
          bars={[40, 65, 50, 80, 90]}
          isPositive={true}
        />
        <MiniChart
          title="Ποσοστό Επιτυχίας"
          value="18.5"
          percent="%"
          bars={[30, 25, 45, 35, 55]}
          isPositive={true}
        />
        <MiniChart
          title="Αιτήσεις Μετάθεσης"
          value="6.702"
          bars={[70, 85, 75, 95, 80]}
          isPositive={false}
        />
        <MiniChart
          title="Μη Ικανοποιηθέντες"
          value="5.462"
          bars={[60, 50, 70, 65, 75]}
          isPositive={false}
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-3 w-full h-full p-2">
      <MiniChart
        title="Ζήτηση (1η Προτ.)"
        value="142"
        bars={[45, 60, 55, 75, 88]}
        isPositive={true}
      />
      <MiniChart
        title="Αιτήσεις Αποχώρησης"
        value="86"
        bars={[30, 45, 40, 55, 65]}
        isPositive={false}
      />
      <MiniChart
        title="Μ.Ο. Επιτυχόντων"
        value="74.2"
        bars={[65, 68, 70, 72, 74]}
        isPositive={true}
      />
      <MiniChart
        title="Μ.Ο. Αιτούντων"
        value="68.5"
        bars={[60, 62, 64, 66, 68]}
        isPositive={true}
      />
    </div>
  )
}
