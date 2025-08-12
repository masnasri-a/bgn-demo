"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ComponentCard from "@/components/common/ComponentCard"
import { useSelectFilterStore } from "@/components/select/select-filter"

function useDescData() {
  const [data, setData] = useState<{
    what: string
    who: string
    where: string
    created_at: string
  }[]>([])
  const [loading, setLoading] = useState(true)
    const { selectedFilter } = useSelectFilterStore();

  useEffect(() => {
    let url = process.env.NEXT_PUBLIC_BASE_API + "/report_user/desc_data"
    if (selectedFilter && selectedFilter !== "Semua") {
      url += `?category=${encodeURIComponent(selectedFilter)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then((result) => {
        setData(result)
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [selectedFilter])
  return { data, loading }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) +
    " " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
}

export default function TableDashboard() {
  const { data, loading } = useDescData()


  return (
    <ComponentCard title="Data Laporan" className="w-full h-[450px]">
      {loading ? (
        <Skeleton className="w-full h-[300px]" />
      ) : (
        <div className="overflow-x-auto">
          <div className="max-h-[300px] overflow-y-auto">
            <table className="min-w-full text-sm  dark:border-gray-800 rounded-lg ">
              <thead className="">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Tanggal</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Apa</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Siapa</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Dimana</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="table-row border-t border-gray-200 dark:border-gray-800">
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">{formatDate(row.created_at)}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300 ">{row.what.length > 50 ? row.what.substring(0, 50) + '...' : row.what}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.who}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.where.length > 25 ? row.where.substring(0, 25) + '...' : row.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ComponentCard>
  )
}
