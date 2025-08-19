"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { HiOutlineClipboardCheck, HiOutlinePresentationChartBar } from "react-icons/hi";
import { Skeleton } from "../ui/skeleton";
import { useKabupatenStore, useKecamatanStore, useKelurahanStore, useProvinceStore } from "../charts/maps/dropdown/hook";

export const EcommerceMetrics = () => {
  const [stats, setStats] = React.useState({ total: 0, month_total: 0 });
  const [loading, setLoading] = React.useState(true);

      const { selected: selectedProv } = useProvinceStore();
      const { selected: selectedKab } = useKabupatenStore();
      const { selected: selectedKec } = useKecamatanStore();
      const { selected: selectedKel } = useKelurahanStore();

  React.useEffect(() => {
    console.log(selectedProv, selectedKab, selectedKec, selectedKel);

    const fetchStats = async () => {
      try {
        setLoading(true);
        let param = new URLSearchParams();
        if (selectedProv !== null) param.append("kd_propinsi", selectedProv.kd_propinsi);
        if (selectedKab !== null) param.append("kd_kabupaten", selectedKab.kd_kabupaten);
        if (selectedKec !== null) param.append("kd_kecamatan", selectedKec.kd_kecamatan);
        if (selectedKel !== null) param.append("kd_kelurahan", selectedKel.kd_kelurahan);
        console.log("param : "+param);
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_API+'/report_user/statistics?' + param.toString());
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedProv, selectedKab, selectedKec, selectedKel]);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {/* <GroupIcon className="text-gray-800 size-6 dark:text-white/90" /> */}
          <HiOutlineClipboardCheck className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Laporan
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {
              loading ? (
                <Skeleton className="h-[20px] w-[100px] rounded-full" />
              ) : (
                stats.total.toLocaleString()
              )
            }
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <HiOutlinePresentationChartBar className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Laporan Bulan Ini
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {
                loading ? (
                  <Skeleton className="h-[20px] w-[100px] rounded-full" />
                ) : (
                  stats.month_total.toLocaleString()
                )
              }
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
