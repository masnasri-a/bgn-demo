import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import SelectFilter from "@/components/select/select-filter";
import CardPie from "@/components/charts/pie/CardPie";
import { BarChartTopContributor } from "@/components/charts/bar/BarChartTopContributor";
import { LineChartTopContributor } from "@/components/charts/line/LineChartTopContributor";
import Heatmap from "@/components/charts/heatmap/Heatmap";
import WordCloud from "@/components/charts/wordcloud/WordCloud";
import PieChartSentiment from "@/components/charts/pie/PieChartSentiment";
import TableDashboard from "@/components/charts/table/TableDashboard";
import MapboxChart from "@/components/charts/maps/MapBoxChart";

export const metadata: Metadata = {
  title:
    "Badan Gizi Nasional Dashboard",
  description: "Dashboard untuk memantau dan menganalisis data gizi nasional",
};

export default function Ecommerce() {
  return (
    <div className="">
      <div className="flex justify-end items-center gap-3 mb-3">
        <span>Pilih Filter </span>
        <div className="w-3/12">
          <SelectFilter />
        </div>

      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <CardPie />
        </div>
        <div className="col-span-12 ">
        <DemographicCard />
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
          <div className="w-4/12">
            <PieChartSentiment />
          </div>
          <div className="w-8/12">

            <TableDashboard />
          </div>
        </div>

      </div>
    </div>
  );
}
