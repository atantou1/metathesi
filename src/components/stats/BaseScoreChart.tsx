'use client'

import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const baseScoreData = [
  { year: '2022', baseScore: 65.2, applicantsAvg: 58.1 },
  { year: '2023', baseScore: 68.4, applicantsAvg: 60.2 },
  { year: '2024', baseScore: 66.1, applicantsAvg: 62.5 },
  { year: '2025', baseScore: 70.0, applicantsAvg: 65.8 },
  { year: '2026', baseScore: 72.45, applicantsAvg: 68.5 },
]

const chartConfig = {
  baseScore: {
    label: "Βάση Μορίων",
    color: "#e11d48", // rose-600
  },
  applicantsAvg: {
    label: "Μ.Ο. Αιτούντων",
    color: "#94a3b8", // slate-400
  },
} satisfies ChartConfig

export function BaseScoreChart() {
  return (
    <div className="w-full h-full pb-4">
      <ChartContainer config={chartConfig} className="h-full w-full min-h-[250px]">
        <LineChart
          accessibilityLayer
          data={baseScoreData}
          margin={{
            left: -20,
            right: 12,
            top: 12,
            bottom: 12,
          }}
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
            domain={['auto', 'auto']}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} className="pt-4" />
          <Line
            dataKey="baseScore"
            type="monotone"
            stroke="var(--color-baseScore)"
            strokeWidth={2.5}
            dot={{
              fill: "var(--color-baseScore)",
              r: 4,
            }}
            activeDot={{
              r: 6,
            }}
          />
          <Line
            dataKey="applicantsAvg"
            type="monotone"
            stroke="var(--color-applicantsAvg)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{
              fill: "var(--color-applicantsAvg)",
              r: 4,
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
