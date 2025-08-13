'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import Swal from 'sweetalert2'
import { toast } from 'sonner'

interface ReportData {
    id: number
    title: string
    url: string
    generated_at: string
    location_id: string
}


const ITEMS_PER_PAGE = 10

export default function TableReport() {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [reports, setReports] = useState<ReportData[]>([])

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch(process.env.NEXT_PUBLIC_BASE_API + `/report/get-all?page=${currentPage}&limit=${ITEMS_PER_PAGE}`)
                const result = await res.json()
                setReports(result.data || [])
                setTotalPages(result.total_page || 1)
                setTotalItems(result.total || 0)
            } catch (error) {
                console.error('Failed to fetch reports:', error)
            }
        }
        fetchReports()
    }, [currentPage])

    const handleDownload = async (url: string, id: number) => {
        // Download file
        toast("Sedang mendownload...")
        const url_download = `${process.env.NEXT_PUBLIC_BASE_API}/report/download?id=${id}&url=${url}`
        const result = await fetch(url_download, {
            method: 'GET'
        })
        const blob = await result.blob()
        const urls = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = urls
        a.download = `${url.split('/').pop()}`
        document.body.appendChild(a)
        a.click()
        a.remove()
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
                            <TableHead>Location ID</TableHead>
                            <TableHead>Generated At</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-gray-500">Sedang Meload Data</TableCell>
                            </TableRow>
                        ) : (
                            reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-mono text-xs">{report.id}</TableCell>
                                    <TableCell className="font-medium">{report.title}</TableCell>
                                    <TableCell>{report.location_id}</TableCell>
                                    <TableCell>{new Date(report.generated_at).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDownload(report.url, report.id)}
                                            className="flex items-center gap-2"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} results
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