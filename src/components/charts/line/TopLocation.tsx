"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts"

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

export const description = "A mixed bar chart"

import React, { useEffect, useState } from "react"
import { useKabupatenStore, useKecamatanStore, useKelurahanStore, useProvinceStore } from "../maps/dropdown/hook"


// chartData will be fetched from API

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function TopLocation() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    console.log("location param :", param.toString());
const urls = "https://bgn-be.anakanjeng.site/report_user/total_per_location?" + param.toString()
console.log("location url :", urls);
    fetch(urls)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          const colorScale = [
            "#8ecaff", // light blue
            "#339aff", // blue
            "#0074e8", // medium blue
            "#0057c2", // darker blue
            "#003a8c"  // darkest blue
          ];
          console.log("data :", data);

          const transformed = data.map((f: any) => ({
            name: f.name,
            total: f.total,
          }));
          console.log("transformed :" +transformed);
          
          // Sort descending by total and take top 5
          const sorted = transformed.sort((a: { total: number }, b: { total: number }) => b.total - a.total).slice(0, 5);
          // Assign color by rank
          const colored = sorted.map((item: { total: number; name: string }, idx: number) => ({ ...item, fill: colorScale[idx] }));
          setChartData(colored);
        }
        setLoading(false);
      });
  }, [selectedProv, selectedKab, selectedKec, selectedKel]);

  return (
    <Card className="h-full overflow-hidden flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Bar Chart - Top Location</CardTitle>
        <CardDescription>Top Provinces by Total</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 10 }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={0}
              axisLine={false}
            />
            <XAxis dataKey="total" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" layout="vertical" radius={5} {
              ...chartData.length > 0 && { data: chartData }
            } fill={undefined} >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        {loading && <div className="text-center py-4">Loading...</div>}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        </CardFooter>
     
    </Card>
  )
}
