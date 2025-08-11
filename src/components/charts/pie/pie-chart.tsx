"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

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
import { Skeleton } from "@/components/ui/skeleton"

export const description = "A donut chart"


import { useEffect, useState } from "react"

function useChartData() {
  const [chartData, setChartData] = useState<{ category: string; total: number }[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BASE_API+"/report_user/total_by_category")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setChartData(data)
        }
      })
      .catch(() => setChartData([]))
      .finally(() => setLoading(false))
  }, [])
  return { chartData, loading }
}

function generateFillColor(list_data: { category: string; total: number }[]) {
  return list_data.map((item, index) => ({
    ...item,
    fill: `hsl(${240 + (index * 60) / list_data.length}, 70%, 50%)`, // Generate colors from blue (240°) to purple (300°)
  }))
}

const chartConfig = {
} satisfies ChartConfig

export function ChartPieDonut() {
  const { chartData, loading } = useChartData()
  return (
    <Card className="flex flex-col !border-0 !shadow-none">
      <CardContent className="flex-1 pb-0">
        {loading ? (
          <Skeleton className="mx-auto aspect-square max-h-[250px] w-[250px] max-w-[250px] h-[250px] rounded-full" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={generateFillColor(chartData)}
                dataKey="total"
                nameKey="category"
                innerRadius={60}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          <span>
            Menaplikan seluruh data laporan
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
