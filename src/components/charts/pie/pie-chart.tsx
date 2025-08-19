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
import { useKabupatenStore, useKecamatanStore, useKelurahanStore, useProvinceStore } from "../maps/dropdown/hook"

export const description = "A donut chart"


import { useEffect, useState } from "react"
import { useDateRangeStore } from "@/store/dateRangeStore"

function useChartData() {
  const [chartData, setChartData] = useState<{ category: string; total: number }[]>([])
  const [loading, setLoading] = useState(true)

    const { selected: selectedProv } = useProvinceStore();
    const { selected: selectedKab } = useKabupatenStore();
    const { selected: selectedKec } = useKecamatanStore();
    const { selected: selectedKel } = useKelurahanStore();
      const { startDate, endDate } = useDateRangeStore();
    
  useEffect(() => {
    let param = new URLSearchParams();
        if (selectedProv !== null) param.append("kd_propinsi", selectedProv.kd_propinsi);
        if (selectedKab !== null) param.append("kd_kabupaten", selectedKab.kd_kabupaten);
        if (selectedKec !== null) param.append("kd_kecamatan", selectedKec.kd_kecamatan);
        if (selectedKel !== null) param.append("kd_kelurahan", selectedKel.kd_kelurahan);
        if (startDate) param.append("start_date", startDate);
        if (endDate) param.append("end_date", endDate);

    fetch(process.env.NEXT_PUBLIC_BASE_API+"/report_user/total_by_category?" + param.toString())
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
