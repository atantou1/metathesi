"use client"

import React from "react"
import { MiniChart } from "./bento-stats-grid"

export function BentoInteractiveCharts() {
  return (
    <div className="grid grid-cols-1 grid-rows-2 gap-3 w-full h-full p-2">
      <MiniChart
        title="Αποχωρήσεις"
        value="450"
        bars={[60, 50, 70, 65, 75]}
        isPositive={false}
      />
      <MiniChart
        title="Διορισμοί"
        value="1.200"
        bars={[40, 65, 50, 80, 90]}
        isPositive={true}
      />
    </div>
  )
}
