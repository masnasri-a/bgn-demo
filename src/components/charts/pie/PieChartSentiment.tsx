"use client"

import { useEffect, useState } from "react"
import { Pie, PieChart } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import ComponentCard from "@/components/common/ComponentCard"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useSelectFilterStore } from "@/components/select/select-filter"

const SENTIMENT_COLORS: Record<string, string> = {
  positif: "#34d399", // green
  netral: "#fbbf24", // yellow
  negatif: "#ef4444", // red
}

function useSentimentData() {
  const [data, setData] = useState<{ sentiment: string; total: number }[]>([])
  const [loading, setLoading] = useState(true)
    const { selectedFilter } = useSelectFilterStore();

  useEffect(() => {
    let url = process.env.NEXT_PUBLIC_BASE_API + "/report_user/total_by_sentiment"
    if (selectedFilter && selectedFilter !== "Semua") {
      url += `?category=${encodeURIComponent(selectedFilter)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then((result: { sentiment: string; total: number }[]) => {
        setData(result)
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [selectedFilter])
  return { data, loading }
}

function generateFillColor(list: { sentiment: string; total: number }[]) {
  return list.map(item => ({
    ...item,
    fill: SENTIMENT_COLORS[item.sentiment.toLowerCase()] || "#38bdf8"
  }))
}

export default function PieChartSentiment() {
  const { data, loading } = useSentimentData()

  return (
    <ComponentCard title="Sentiment Pie Chart" className="w-full h-[450px]">
      <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px]">
        {loading ? (
          <Skeleton className="mx-auto aspect-square max-h-[250px] w-full h-[250px]" />
        ) : (
          <PieChart width={250} height={250}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={generateFillColor(data)}
              dataKey="total"
              nameKey="sentiment"
              innerRadius={60}
              outerRadius={100}
            />
          </PieChart>
        )}
      </ChartContainer>
    </ComponentCard>
  )
}
