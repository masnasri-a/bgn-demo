"use client"

import { useEffect, useState } from "react"
import { Pie, PieChart } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import ComponentCard from "@/components/common/ComponentCard"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useSelectFilterStore } from "@/components/select/select-filter"
import { useKabupatenStore, useKecamatanStore, useKelurahanStore, useProvinceStore } from "../maps/dropdown/hook"
import { useDateRangeStore } from "@/store/dateRangeStore"

const SENTIMENT_COLORS: Record<string, string> = {
  positif: "#34d399", // green
  netral: "#fbbf24", // yellow
  negatif: "#ef4444", // red
}

function useSentimentData() {
  const [data, setData] = useState<{ sentiment: string; total: number }[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedFilter } = useSelectFilterStore();
  const { startDate, endDate } = useDateRangeStore();
  const { selected: selectedProv } = useProvinceStore();
  const { selected: selectedKab } = useKabupatenStore();
  const { selected: selectedKec } = useKecamatanStore();
  const { selected: selectedKel } = useKelurahanStore();

  useEffect(() => {
    let param = new URLSearchParams();
    if (selectedProv !== null) param.append("kd_propinsi", selectedProv.kd_propinsi);
    if (selectedKab !== null) param.append("kd_kabupaten", selectedKab.kd_kabupaten);
    if (selectedKec !== null) param.append("kd_kecamatan", selectedKec.kd_kecamatan);
    if (selectedKel !== null) param.append("kd_kelurahan", selectedKel.kd_kelurahan);
    if (startDate) param.append("start_date", startDate);
    if (endDate) param.append("end_date", endDate);
    if (selectedFilter && selectedFilter !== "Semua") {
      param.append("category", selectedFilter);
    }
    let url = process.env.NEXT_PUBLIC_BASE_API + "/report_user/total_by_sentiment?" + param.toString();
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
      {/* Legend */}
      {!loading && (
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {generateFillColor(data).map(item => (
            <div key={item.sentiment} className="flex items-center gap-2 text-sm">
              <span style={{ background: item.fill, width: 16, height: 16, borderRadius: 4, display: 'inline-block', border: '1px solid #eee' }}></span>
              <span className="font-medium capitalize">{item.sentiment}</span>
              <span className="text-xs text-gray-500">({item.total})</span>
            </div>
          ))}
        </div>
      )}
    </ComponentCard>
  )
}
