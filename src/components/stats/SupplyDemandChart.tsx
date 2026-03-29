'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const supplyDemandData = [
  { year: '2022', demand: 110, transfers: 15 },
  { year: '2023', demand: 125, transfers: 12 },
  { year: '2024', demand: 120, transfers: 10 },
  { year: '2025', demand: 133, transfers: 5 },
  { year: '2026', demand: 145, transfers: 8 },
]

const chartConfig = {
  demand: {
    label: "Ζήτηση (1η Προτίμηση)",
    color: "#38bdf8", // sky-400
  },
  transfers: {
    label: "Μεταθέσεις (Επιτυχόντες)",
    color: "#0369a1", // sky-700
  },
} satisfies ChartConfig

export function SupplyDemandChart() {
  return (
    <div className="w-full h-full pb-4">
      <ChartContainer config={chartConfig} className="h-full w-full min-h-[250px]">
        <BarChart
          accessibilityLayer
          data={supplyDemandData}
          margin={{
            left: -20,
            right: 12,
            top: 12,
            bottom: 12,
          }}
          barGap={4}
        >
          <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#f1f5f9" />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
            domain={[0, 'auto']}
          />
          <ChartTooltip cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} className="pt-4" />
          <Bar
            dataKey="demand"
            fill="var(--color-demand)"
            radius={6}
            barSize={20}
          />
          <Bar
            dataKey="transfers"
            fill="var(--color-transfers)"
            radius={6}
            barSize={20}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
