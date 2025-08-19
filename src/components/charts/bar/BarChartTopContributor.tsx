"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import ComponentCard from "@/components/common/ComponentCard"

export const description = "A horizontal bar chart"


import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useSelectFilterStore } from "@/components/select/select-filter"
import { useKabupatenStore, useKecamatanStore, useKelurahanStore, useProvinceStore } from "../maps/dropdown/hook"
import { useDateRangeStore } from "@/store/dateRangeStore"

const BLUE_SKY = "#38bdf8"

function useContributorData() {
    const [chartData, setChartData] = useState<{ name: string; total: number }[]>([])
    const [loading, setLoading] = useState(true)
    const { selectedFilter } = useSelectFilterStore();

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

        let url = process.env.NEXT_PUBLIC_BASE_API + "/report_user/total_by_created_by?" + param.toString();
        if (selectedFilter && selectedFilter !== "Semua") {
            url += `?category=${encodeURIComponent(selectedFilter)}`;
        }
        fetch(url)
            .then(res => res.json())
            .then((result: { created_by: string; name: string; total: number }[]) => {
                const parsed = result.map(item => ({
                    name: item.name,
                    total: item.total
                }))
                setChartData(parsed)
            })
            .catch(() => setChartData([]))
            .finally(() => setLoading(false))
    }, [selectedFilter, startDate, endDate, selectedProv, selectedKab, selectedKec, selectedKel])
    return { chartData, loading }
}

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function BarChartTopContributor() {
    const { chartData, loading } = useContributorData()
    return (
        <ComponentCard title="Kontributor Terbanyak" className="w-full max-h-[500px]">
            {loading ? (
                <Skeleton className="w-full h-[220px]" />
            ) : (
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{}}
                    >
                        <XAxis type="number" dataKey="total" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={15}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 5)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="total" fill={BLUE_SKY} radius={5} />
                    </BarChart>
                </ChartContainer>
            )}
        </ComponentCard>
    )
}
