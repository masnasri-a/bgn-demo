"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ComponentCard from "@/components/common/ComponentCard"
import { useSelectFilterStore } from "@/components/select/select-filter"
import { useKabupatenStore, useKecamatanStore, useKelurahanStore, useProvinceStore } from "../maps/dropdown/hook"
import { useDateRangeStore } from "@/store/dateRangeStore"

function useDescData() {
  const [data, setData] = useState<{
    what: string
    who: string
    where: string
    created_at: string
  }[]>([])
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
    if (selectedFilter && selectedFilter !== "Semua") {
      param.append("category", selectedFilter);
    }
    let url = process.env.NEXT_PUBLIC_BASE_API + "/report_user/desc_data?" + param.toString()
    fetch(url)
      .then(res => res.json())
      .then((result) => {
        setData(result)
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [selectedFilter, startDate, endDate, selectedProv, selectedKab, selectedKec, selectedKel])
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
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="table-row border-t border-gray-200 dark:border-gray-800">
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">{formatDate(row.created_at)}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300 ">{row.what.length > 50 ? row.what.substring(0, 50) + '...' : row.what}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.who}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.where.length > 25 ? row.where.substring(0, 25) + '...' : row.where}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                      <a href="/cctv/kemang-jakarta-selatan" className="text-blue-500 hover:underline">View</a>
                    </td>
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
