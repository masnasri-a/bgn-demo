
import { MessageSquare, DollarSign } from "lucide-react"
import { HiDocument, HiDocumentReport } from "react-icons/hi"

export default function CardReport() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
			{/* Card 1 */}
			<div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm flex flex-col gap-2 border border-gray-100 dark:border-gray-800">
				<div className="flex items-center mb-2">
					<div className="bg-indigo-100 text-indigo-600 rounded-lg p-2 mr-2">
						<MessageSquare size={24} />
					</div>
					<span className="font-semibold text-gray-800 dark:text-white text-base">Generate Hasil Report</span>
				</div>
				<div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Analisis hasil pelaporan badan gizi nasional</div>
                <button 
                    onClick={() => window.location.href = '/report/add-report'}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 w-fit"
                >
                    <span>⚡</span> Generate Report
                </button>
			</div>

			{/* Card 2 */}
			<div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm flex flex-col gap-2 border border-gray-100 dark:border-gray-800">
				<div className="flex items-center mb-2">
                    <div className="bg-blue-100 text-blue-600 rounded-lg p-2 mr-2">
                        <HiDocument size={24} />
                    </div>
					<span className="font-semibold text-gray-800 dark:text-white text-base">Total Report</span>
				</div>
				<div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">144 Report</div>
				<div className="bg-green-100 text-green-600 rounded px-2 py-1 text-xs font-semibold w-fit">+2 report hari ini</div>
			</div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm flex flex-col gap-2 border border-gray-100 dark:border-gray-800">
				<div className="flex items-center mb-2">
                    <div className="bg-blue-100 text-blue-600 rounded-lg p-2 mr-2">
                        <HiDocumentReport size={24} />
                    </div>
					<span className="font-semibold text-gray-800 dark:text-white text-base">Total Report Bulan Ini</span>
				</div>
				<div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">15 Report</div>
				<div className="bg-orange-100 text-orange-600 rounded px-2 py-1 text-xs font-semibold w-fit">-5 report dari bulan sebelumnya</div>
			</div>
		</div>
	)
}
