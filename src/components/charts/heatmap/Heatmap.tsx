"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ComponentCard from "@/components/common/ComponentCard"
import {
  ChartContainer,
} from "@/components/ui/chart"

// Simple heatmap rendering using divs, styled to match other charts
const BLUE_SKY = "#38bdf8"

function useHeatmapData() {
  const [data, setData] = useState<{ date: string; total: number }[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BASE_API + "/report_user/heatmap")
      .then(res => res.json())
      .then((result: { date: string; total: number }[]) => {
        setData(result)
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [])
  return { data, loading }
}

function getIntensityColor(total: number) {
  // Map total to opacity for blue sky
  // You can adjust maxTotal for scaling
  const maxTotal = 5
  const opacity = Math.min(0.1 + total / maxTotal, 1)
  return `rgba(56, 189, 248, ${opacity})` // blue sky with opacity
}


export default function Heatmap() {
  const { data, loading } = useHeatmapData()

  // Prepare grid: months as rows, days as columns
  const monthsAll = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const days = Array.from({ length: 30 }, (_, i) => i + 1)

  // Get current month and previous 5 months
  const now = new Date()
  let monthIdx = now.getMonth()
  let year = now.getFullYear()
  const months: string[] = []
  for (let i = 0; i < 8; i++) {
    months.unshift(monthsAll[monthIdx])
    monthIdx--
    if (monthIdx < 0) {
      monthIdx = 11
      year--
    }
  }

  // Group data by month and day, only for last 6 months
  const grid: Record<string, Record<number, { date: string; total: number }>> = {}
  data.forEach(item => {
    const dateObj = new Date(item.date)
    const month = monthsAll[dateObj.getMonth()]
    const day = dateObj.getDate()
    const itemYear = dateObj.getFullYear()
    // Only include if month is in months and year matches
    if (months.includes(month) && (itemYear === now.getFullYear() || itemYear === now.getFullYear() - 1)) {
      if (!grid[month]) grid[month] = {}
      grid[month][day] = item
    }
  })

  return (
    <ComponentCard title="Heatmap" className="w-full max-h-[450px]">
      <ChartContainer config={{}}>
        {loading ? (
          <Skeleton className="w-full h-[300px]" />
        ) : (
          <div className="p-4">
            {/* Days header */}
            <div className="flex items-center mb-2 ml-10 gap-0.5">
              {days.map(day => (
                <div key={day} className="w-6 h-6 flex items-center justify-center text-xs text-gray-700 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>
            {/* Month rows */}
            <div className="flex flex-col gap-1">
              {months.map(month => (
                <div key={month} className="flex items-center gap-0.5">
                  {/* Month label */}
                  <div className="w-10 text-xs font-semibold text-gray-700 dark:text-gray-400 mr-1">
                    {month}
                  </div>
                  {/* Day cells */}
                  {days.map(day => {
                    const cell = grid[month]?.[day]
                    return (
                      <div
                        key={day}
                        className="w-6 h-6 rounded border border-gray-200 dark:border-gray-800 relative group cursor-pointer"
                        style={{ background: cell ? getIntensityColor(cell.total) : "#f3f4f6" }}
                      >
                        {cell && (
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            {cell.date}: {cell.total}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </ChartContainer>
    </ComponentCard>
  )
}
