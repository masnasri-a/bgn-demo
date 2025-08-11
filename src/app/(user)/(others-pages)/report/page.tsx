"use client"
import React from 'react'
import TableReport from './tableReport'
import CardReport from './cardReport'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'

const Report = () => {
  return (
    <div>
      <PageBreadcrumb pageTitle="Report" />
      <CardReport />
      <TableReport />
    </div>
  )
}

export default Report