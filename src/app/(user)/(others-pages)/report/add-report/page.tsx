"use client"

import { useState } from "react"
import DatePicker from '@/components/form/date-picker'
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function AddReportPage() {
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");
    const [disabled, setDisabled] = useState(false);

    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !startDate || !endDate) {
            setError("Semua field wajib diisi.");
            return;
        }
        if (new Date(endDate) <= new Date(startDate)) {
            setError("End date harus setelah start date.");
            return;
        }
        setError("");
        
        toast("Sedang generate report...");
        setDisabled(true);

        // Fetch API /report/generate (GET)
        try {
            const params = new URLSearchParams({
                location_id: '31.17',
                start_date: startDate,
                end_date: endDate,
                title,
            }).toString();
            const url = process.env.NEXT_PUBLIC_BASE_API + '/report/generate?' + params;
            const res = await fetch(url, {
                method: 'GET',
            });
            const result = await res.json();
            if (res.status === 200) {
                toast.success("Report generated successfully.");
                router.push("/report");
            } else {
                toast.error("Failed to generate report.");
            }
            setDisabled(false);
            console.log('API result:', result);
        } catch (err) {
            setError('Gagal generate report.');
        }

    }

    return (
        <div className="w-full mt-8">
            <PageBreadcrumb pageTitle="Generate Report" />
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={onSubmit}>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul</label>
                        <input
                            type="text"
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
                            placeholder="Masukkan judul laporan"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="col-span-2 flex gap-6">
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                            <DatePicker
                                id="start-date"
                                label={undefined}
                                mode="single"
                                defaultDate={startDate}
                                placeholder="Pilih tanggal mulai"
                                onChange={([date]: any) => setStartDate(date ? date.toISOString().slice(0, 10) : "")}
                            />
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                            <DatePicker
                                id="end-date"
                                label={undefined}
                                mode="single"
                                defaultDate={endDate}
                                placeholder="Pilih tanggal akhir"
                                onChange={([date]: any) => setEndDate(date ? date.toISOString().slice(0, 10) : "")}
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="col-span-2 text-red-600 text-sm mt-2">{error}</div>
                    )}
                    <div className="col-span-2 flex justify-end mt-4">
                        <button
                            type="button"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg shadow mr-4"
                            onClick={() => window.history.back()}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={disabled}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow flex items-center gap-2"
                        >
                            Generate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
