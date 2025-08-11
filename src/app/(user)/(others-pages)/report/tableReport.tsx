'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'



interface ReportData {
    id: string
    title: string
    created_by: string
    created_at: string
}

const dummyData: ReportData[] = [
    { id: 'uuid-001', title: 'Monthly Sales Report', created_by: 'John Doe', created_at: '2024-01-15' },
    { id: 'uuid-002', title: 'Quarterly Revenue Analysis', created_by: 'Jane Smith', created_at: '2024-01-14' },
    { id: 'uuid-003', title: 'Customer Feedback Summary', created_by: 'Mike Johnson', created_at: '2024-01-13' },
    { id: 'uuid-004', title: 'Product Performance Report', created_by: 'Sarah Wilson', created_at: '2024-01-12' },
    { id: 'uuid-005', title: 'Marketing Campaign Results', created_by: 'Tom Brown', created_at: '2024-01-11' },
    { id: 'uuid-006', title: 'Inventory Status Report', created_by: 'Lisa Davis', created_at: '2024-01-10' },
    { id: 'uuid-007', title: 'Employee Performance Review', created_by: 'Chris Anderson', created_at: '2024-01-09' },
    { id: 'uuid-008', title: 'Financial Statement Q4', created_by: 'Emma Martinez', created_at: '2024-01-08' },
    { id: 'uuid-009', title: 'Website Analytics Report', created_by: 'David Lee', created_at: '2024-01-07' },
    { id: 'uuid-010', title: 'Customer Acquisition Cost', created_by: 'Amy Taylor', created_at: '2024-01-06' },
    { id: 'uuid-011', title: 'Social Media Engagement', created_by: 'Kevin White', created_at: '2024-01-05' },
    { id: 'uuid-012', title: 'Cost Analysis Report', created_by: 'Rachel Green', created_at: '2024-01-04' },
    { id: 'uuid-013', title: 'Risk Assessment Summary', created_by: 'Mark Thompson', created_at: '2024-01-03' },
    { id: 'uuid-014', title: 'Compliance Audit Report', created_by: 'Julia Roberts', created_at: '2024-01-02' },
    { id: 'uuid-015', title: 'Strategic Planning Document', created_by: 'Robert King', created_at: '2024-01-01' },
]

const ITEMS_PER_PAGE = 10

export default function TableReport() {
    const [currentPage, setCurrentPage] = useState(1)
    
    const totalPages = Math.ceil(dummyData.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const currentData = dummyData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handleDownload = (id: string, title: string) => {
        console.log(`Downloading report: ${title} (${id})`)
        // Add download logic here
    }

    const nextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages))
    }

    const prevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Created By</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentData.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell className="font-mono text-xs">{report.id}</TableCell>
                                <TableCell className="font-medium">{report.title}</TableCell>
                                <TableCell>{report.created_by}</TableCell>
                                <TableCell>{report.created_at}</TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDownload(report.id, report.title)}
                                        className="flex items-center gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, dummyData.length)} of {dummyData.length} results
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}