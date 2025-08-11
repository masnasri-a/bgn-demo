"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

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

export const description = "A horizontal bar chart"


import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const BLUE_SKY = "#38bdf8" // Tailwind sky-400

function useContributorData() {
    const [chartData, setChartData] = useState<{ name: string; total: number }[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_BASE_API + "/report_user/total_by_created_by")
            .then(res => res.json())
            .then((result: { created_by: string; total: number }[]) => {
                const parsed = result.map(item => ({
                    name: item.created_by,
                    total: item.total
                }))
                setChartData(parsed)
            })
            .catch(() => setChartData([]))
            .finally(() => setLoading(false))
    }, [])
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
        <ComponentCard title="Kontributor Terbanyak" className="w-full max-h-[450px]">
            {loading ? (
                <Skeleton className="w-full h-[220px]" />
            ) : (
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{ left: -20 }}
                    >
                        <XAxis type="number" dataKey="total" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={5}
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
