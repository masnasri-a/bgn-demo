"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ComponentCard from "@/components/common/ComponentCard"
import { ChartContainer } from "@/components/ui/chart"

// Helper to generate random color from a palette
const COLORS = [
  "#38bdf8", // blue sky
  "#34d399", // green
  "#fbbf24", // orange
  "#ef4444", // red
  "#a78bfa", // purple
  "#f472b6", // pink
  "#facc15", // yellow
  "#10b981", // teal
  "#6366f1", // indigo
]

function getColor(idx: number) {
  return COLORS[idx % COLORS.length]
}

function useWordCloudData() {
  const [data, setData] = useState<{ word: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)
      const { selectedFilter } = useSelectFilterStore();
  
  useEffect(() => {
    let url = process.env.NEXT_PUBLIC_BASE_API + "/report_user/wordcloud"
    if (selectedFilter && selectedFilter !== "Semua") {
      url += `?category=${encodeURIComponent(selectedFilter)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then((result: { word: string; count: number }[]) => {
        setData(result)
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [selectedFilter])
  return { data, loading }
}


import { useRef, useLayoutEffect } from "react"
import { useSelectFilterStore } from "@/components/select/select-filter"

export default function WordCloud() {
  const { data, loading } = useWordCloudData()
  const containerRef = useRef<HTMLDivElement>(null)
  const [fontRange, setFontRange] = useState({ min: 10, max: 60 })

  // Sort by count descending
  const sorted = [...data].sort((a, b) => b.count - a.count)
  const minCount = sorted.length > 0 ? sorted[sorted.length - 1].count : 1
  const maxCount = sorted.length > 0 ? sorted[0].count : 1

  // Dynamically calculate font size range based on container size and word count
  useLayoutEffect(() => {
    if (containerRef.current && sorted.length > 0) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      // Estimate max font size so all words fit
      // This is a simple heuristic: you can tune these numbers for your design
      const maxFont = Math.max(18, Math.min(80, Math.floor(Math.sqrt((width * height) / sorted.length) * 0.5)))
      const minFont = Math.max(8, Math.floor(maxFont * 0.3))
      setFontRange({ min: minFont, max: maxFont })
    }
  }, [sorted.length, loading])

  function getFontSize(count: number) {
    if (maxCount === minCount) return fontRange.max
    return fontRange.min + ((count - minCount) / (maxCount - minCount)) * (fontRange.max - fontRange.min)
  }

  return (
    <ComponentCard title="Word Cloud" className="w-full max-h-[450px]">
      <ChartContainer config={{}}>
        {loading ? (
          <Skeleton className="w-full h-[300px]" />
        ) : (
          <div
            ref={containerRef}
            className="flex flex-wrap items-center justify-center gap-2 p-4"
            style={{ minHeight: 300, maxHeight: 300, overflow: "hidden" }}
          >
            {sorted.map((item, idx) => (
              <span
                key={item.word}
                style={{
                  fontSize: `${getFontSize(item.count)}px`,
                  color: getColor(idx),
                  fontWeight: 600,
                  lineHeight: 1.1,
                  margin: "0px",
                  display: "inline-block",
                  transform: `rotate(${(idx % 5 - 2) * 8}deg)`
                }}
              >
                {item.word}
              </span>
            ))}
          </div>
        )}
      </ChartContainer>
    </ComponentCard>
  )
}
