import ComponentCard from '@/components/common/ComponentCard'
import React from 'react'
import { ChartPieDonut } from './pie-chart'

const CardPie = () => {
  return (
    <div className="space-y-6">
        <ComponentCard title="Total Berdasar Kategori">
          <ChartPieDonut />
        </ComponentCard>
      </div>
  )
}

export default CardPie