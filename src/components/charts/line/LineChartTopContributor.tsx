"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import ComponentCard from "@/components/common/ComponentCard"

export const description = "A multiple line chart"


import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const COLORS = [
  "#38bdf8", // blue sky
  "#34d399", // green
  "#fbbf24", // orange
  "#ef4444", // red
  "#a78bfa", // purple
]

function useTrendContributorData() {
  const [chartData, setChartData] = useState<any[]>([])
  const [contributors, setContributors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BASE_API + "/report_user/trend_contributor")
      .then(res => res.json())
      .then((result: { date: string; data: { name: string; total: number }[] }[]) => {
        // Get all contributor names
        const names = result.length > 0 ? result[0].data.map(d => d.name) : []
        setContributors(names)
        // Parse chartData for recharts
        const parsed = result.map(item => {
          const dateObj = new Date(item.date)
          const day = dateObj.getDate().toString().padStart(2, '0')
          const month = dateObj.toLocaleString('en-US', { month: 'short' })
          const entry: any = { date: `${day} ${month}` }
          item.data.forEach(d => {
            entry[d.name] = d.total
          })
          return entry
        })
        setChartData(parsed)
      })
      .catch(() => setChartData([]))
      .finally(() => setLoading(false))
  }, [])
  return { chartData, contributors, loading }
}


// chartConfig will be generated dynamically for contributors

export function LineChartTopContributor() {
  const { chartData, contributors, loading } = useTrendContributorData()
  return (
    <ComponentCard title="Trend Contributor" className="w-full max-h-[450px]">
      {loading ? (
        <Skeleton className="w-full h-[300px]" />
      ) : (
        <ChartContainer config={{}}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {contributors.map((name, idx) => (
              <Line
                key={name}
                dataKey={name}
                type="monotone"
                stroke={COLORS[idx] || COLORS[COLORS.length-1]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      )}
    </ComponentCard>
  )
}
