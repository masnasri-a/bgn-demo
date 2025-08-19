"use client"
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect } from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import SelectFilter from "@/components/select/select-filter";
import CardPie from "@/components/charts/pie/CardPie";
import { BarChartTopContributor } from "@/components/charts/bar/BarChartTopContributor";
import { LineChartTopContributor } from "@/components/charts/line/LineChartTopContributor";
import Heatmap from "@/components/charts/heatmap/Heatmap";
import WordCloud from "@/components/charts/wordcloud/WordCloud";
import PieChartSentiment from "@/components/charts/pie/PieChartSentiment";
import TableDashboard from "@/components/charts/table/TableDashboard";
import ProvinsiDropdown from "@/components/charts/maps/dropdown/provinsi";
import KabupatenDropdown from "@/components/charts/maps/dropdown/kabupaten";
import KecamatanDropdown from "@/components/charts/maps/dropdown/kecamatan";
import KelurahanDropdown from "@/components/charts/maps/dropdown/kelurahan";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { DatePickerRange } from "@/components/date-picker/range";
import { useProvinceStore } from "@/components/charts/maps/dropdown/hook";
import { SentimentStack } from "@/components/charts/line/SentimentStack";
import { TopLocation } from "@/components/charts/line/TopLocation";


export default function Ecommerce() {
  const { selected: selectedProv, setSelected: setSelectedProv } = useProvinceStore();

  useEffect(() => {
    // check location Id
    const locationId = localStorage.getItem("kd_propinsi");
    const locationName = localStorage.getItem("nm_propinsi");
    if (locationId != null && locationName != null) {
      console.log("masuk");
      
      setSelectedProv({ kd_propinsi: locationId.replaceAll('"', ''), nm_propinsi: locationName.replaceAll('"', '') });
    }

  }, []);

  return (
    <div className="">
      <div className="flex justify-end items-end flex-col gap-3 mb-3">
        <Popover>
          <PopoverTrigger asChild><Button variant="outline">Pilih Filter</Button></PopoverTrigger>
          <PopoverContent className="w-[500px] z-20 me-10 mt-5">
            <div className="bg-white p-8 rounded border border-gray-800 space-y-5">
              <label htmlFor="provinsi" className="text-sm font-medium">Kategori:</label>
              <SelectFilter />
              <div className="mb-2 flex flex-col items-start gap-2 justify-end">
                <label htmlFor="provinsi" className="text-sm font-medium">Provinsi:</label>
                <ProvinsiDropdown />
                <KabupatenDropdown />
                <KecamatanDropdown />
                <KelurahanDropdown />
              </div>
              <div className="mt-2">
                <label htmlFor="provinsi" className="text-sm font-medium">Tanggal:</label>
                <DatePickerRange />
              </div>
            </div>
          </PopoverContent>
        </Popover>



      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 ">
          <DemographicCard />
        </div>
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <CardPie />
        </div>
        <div className="col-span-12 flex gap-6">
          <div className="w-4/12 h-full">
            <PieChartSentiment />
          </div>
          <div className="w-4/12 h-full">

            <SentimentStack />
          </div>
          <div className="w-4/12 h-full">

            <TopLocation />
          </div>
        </div>

        <div className="col-span-12 space-y-6 gap-6 flex">
          <BarChartTopContributor />
          <LineChartTopContributor />
        </div>
        <div className="col-span-12 flex gap-5">
          <Heatmap />
          <WordCloud />
        </div>

        <div className="col-span-12 flex gap-6 ">
            <TableDashboard />
        </div>

      </div>
    </div>
  );
}
