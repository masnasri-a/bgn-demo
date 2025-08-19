"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import React, { useEffect, useState } from "react"

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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useKabupatenStore, useKecamatanStore, useKelurahanStore, useProvinceStore } from "../maps/dropdown/hook"
import { useDateRangeStore } from "@/store/dateRangeStore"
import { useSelectFilterStore } from "@/components/select/select-filter"

export const description = "A stacked bar chart with a legend"

// chartData will be fetched from API

const chartConfig = {
    Positif: {
        label: "Positif",
        color: "hsl(120, 100%, 50%)",
    },
    Netral: {
        label: "Netral",
        color: "hsl(240, 100%, 50%)",
    },
    Negatif: {
        label: "Negatif",
        color: "hsl(0, 100%, 50%)",
    },
} satisfies ChartConfig

export function SentimentStack() {
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { startDate, endDate } = useDateRangeStore();
    const { selectedFilter } = useSelectFilterStore();
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
        console.log("sentiment param :", param.toString());

        if (selectedFilter && selectedFilter !== "Semua") {
            param.append("category", selectedFilter);
        }
        fetch("https://bgn-be.anakanjeng.site/report_user/sentiment_category?" + param.toString())
            .then((res) => res.json())
            .then((data) => {
                // Transform API data to stacked bar format
                // Group by category, each sentiment as a key
                const grouped: Record<string, any> = {};
                data.forEach((item: any) => {
                    if (!grouped[item.category]) {
                        grouped[item.category] = { category: item.category };
                    }
                    grouped[item.category][item.sentiment] = item.total;
                });
                setChartData(Object.values(grouped));
                setLoading(false);
            });
    }, [selectedProv, selectedKab, selectedKec, selectedKel, startDate, endDate]);

    return (
        <Card className="h-full overflow-hidden flex flex-col justify-between">
            <CardHeader>
                <CardTitle>Sentiment Per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                            dataKey="Positif"
                            stackId="a"
                            fill="#87ceeb" // blue sky
                            radius={[0, 0, 4, 4]}
                        />
                        <Bar
                            dataKey="Netral"
                            stackId="a"
                            fill="#bfefff" // lighter blue sky
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="Negatif"
                            stackId="a"
                            fill="#4682b4" // steel blue
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
                {loading && <div className="text-center py-4">Loading...</div>}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
        </Card>
    )
}
