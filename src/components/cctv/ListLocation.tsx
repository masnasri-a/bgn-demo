"use client";
import React, { useState } from "react";
import Select from "@/components/form/Select";
import { useRouter } from "next/navigation";

interface LocationData {
  id: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  slug: string;
  cctvCount: number;
  lastMaintenance: string;
  status: 'active' | 'maintenance' | 'offline';
}

export default function ListLocation() {
  const router = useRouter();
  const [provinceFilter, setProvinceFilter] = useState("");
  const [regencyFilter, setRegencyFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const itemsPerPage = 12;

  // Dummy data untuk lokasi
  const locationData: LocationData[] = [
    {
      id: "1",
      village: "Kemang",
      district: "Kemang",
      regency: "Jakarta Selatan",
      province: "DKI Jakarta",
      slug: "kemang-jakarta-selatan",
      cctvCount: 12,
      lastMaintenance: "2024-12-15",
      status: "active"
    },
    {
      id: "2",
      village: "Menteng",
      district: "Menteng",
      regency: "Jakarta Pusat",
      province: "DKI Jakarta",
      slug: "menteng-jakarta-pusat",
      cctvCount: 8,
      lastMaintenance: "2024-12-10",
      status: "active"
    },
    {
      id: "3",
      village: "Kelapa Gading",
      district: "Kelapa Gading",
      regency: "Jakarta Utara",
      province: "DKI Jakarta",
      slug: "kelapa-gading-jakarta-utara",
      cctvCount: 15,
      lastMaintenance: "2024-12-12",
      status: "active"
    },
    {
      id: "4",
      village: "Tanah Abang",
      district: "Tanah Abang",
      regency: "Jakarta Pusat",
      province: "DKI Jakarta",
      slug: "tanah-abang-jakarta-pusat",
      cctvCount: 20,
      lastMaintenance: "2024-12-08",
      status: "maintenance"
    },
    {
      id: "5",
      village: "Cipete",
      district: "Cipete Selatan",
      regency: "Jakarta Selatan",
      province: "DKI Jakarta",
      slug: "cipete-jakarta-selatan",
      cctvCount: 6,
      lastMaintenance: "2024-12-14",
      status: "active"
    },
    {
      id: "6",
      village: "Pondok Indah",
      district: "Pondok Indah",
      regency: "Jakarta Selatan",
      province: "DKI Jakarta",
      slug: "pondok-indah-jakarta-selatan",
      cctvCount: 18,
      lastMaintenance: "2024-12-11",
      status: "active"
    },
    {
      id: "7",
      village: "Senayan",
      district: "Senayan",
      regency: "Jakarta Pusat",
      province: "DKI Jakarta",
      slug: "senayan-jakarta-pusat",
      cctvCount: 25,
      lastMaintenance: "2024-12-13",
      status: "active"
    },
    {
      id: "8",
      village: "Kuningan",
      district: "Kuningan",
      regency: "Jakarta Selatan",
      province: "DKI Jakarta",
      slug: "kuningan-jakarta-selatan",
      cctvCount: 14,
      lastMaintenance: "2024-12-09",
      status: "active"
    },
    {
      id: "9",
      village: "Semarang Barat",
      district: "Semarang Barat",
      regency: "Semarang",
      province: "Jawa Tengah",
      slug: "semarang-barat-jawa-tengah",
      cctvCount: 10,
      lastMaintenance: "2024-12-07",
      status: "offline"
    },
    {
      id: "10",
      village: "Candisari",
      district: "Candisari",
      regency: "Semarang",
      province: "Jawa Tengah",
      slug: "candisari-semarang",
      cctvCount: 7,
      lastMaintenance: "2024-12-16",
      status: "active"
    },
    {
      id: "11",
      village: "Pedurungan",
      district: "Pedurungan",
      regency: "Semarang",
      province: "Jawa Tengah",
      slug: "pedurungan-semarang",
      cctvCount: 9,
      lastMaintenance: "2024-12-05",
      status: "active"
    },
    {
      id: "12",
      village: "Banyumanik",
      district: "Banyumanik",
      regency: "Semarang",
      province: "Jawa Tengah",
      slug: "banyumanik-semarang",
      cctvCount: 11,
      lastMaintenance: "2024-12-06",
      status: "maintenance"
    },
    {
      id: "13",
      village: "Gubeng",
      district: "Gubeng",
      regency: "Surabaya",
      province: "Jawa Timur",
      slug: "gubeng-surabaya",
      cctvCount: 16,
      lastMaintenance: "2024-12-04",
      status: "active"
    },
    {
      id: "14",
      village: "Wonokromo",
      district: "Wonokromo",
      regency: "Surabaya",
      province: "Jawa Timur",
      slug: "wonokromo-surabaya",
      cctvCount: 13,
      lastMaintenance: "2024-12-17",
      status: "active"
    },
    {
      id: "15",
      village: "Rungkut",
      district: "Rungkut",
      regency: "Surabaya",
      province: "Jawa Timur",
      slug: "rungkut-surabaya",
      cctvCount: 8,
      lastMaintenance: "2024-12-03",
      status: "active"
    },
    {
      id: "16",
      village: "Tegalsari",
      district: "Tegalsari",
      regency: "Surabaya",
      province: "Jawa Timur",
      slug: "tegalsari-surabaya",
      cctvCount: 12,
      lastMaintenance: "2024-12-02",
      status: "offline"
    }
  ];

  // Options untuk filter
  const provinceOptions = [
    { value: "", label: "Semua Provinsi" },
    { value: "DKI Jakarta", label: "DKI Jakarta" },
    { value: "Jawa Tengah", label: "Jawa Tengah" },
    { value: "Jawa Timur", label: "Jawa Timur" }
  ];

  const regencyOptions = [
    { value: "", label: "Semua Kabupaten/Kota" },
    { value: "Jakarta Selatan", label: "Jakarta Selatan" },
    { value: "Jakarta Pusat", label: "Jakarta Pusat" },
    { value: "Jakarta Utara", label: "Jakarta Utara" },
    { value: "Semarang", label: "Semarang" },
    { value: "Surabaya", label: "Surabaya" }
  ];

  const districtOptions = [
    { value: "", label: "Semua Kecamatan" },
    { value: "Kemang", label: "Kemang" },
    { value: "Menteng", label: "Menteng" },
    { value: "Kelapa Gading", label: "Kelapa Gading" },
    { value: "Tanah Abang", label: "Tanah Abang" },
    { value: "Cipete Selatan", label: "Cipete Selatan" },
    { value: "Pondok Indah", label: "Pondok Indah" },
    { value: "Senayan", label: "Senayan" },
    { value: "Kuningan", label: "Kuningan" },
    { value: "Semarang Barat", label: "Semarang Barat" },
    { value: "Candisari", label: "Candisari" },
    { value: "Pedurungan", label: "Pedurungan" },
    { value: "Banyumanik", label: "Banyumanik" },
    { value: "Gubeng", label: "Gubeng" },
    { value: "Wonokromo", label: "Wonokromo" },
    { value: "Rungkut", label: "Rungkut" },
    { value: "Tegalsari", label: "Tegalsari" }
  ];

  // Filter data berdasarkan filter yang dipilih
  const filteredData = locationData.filter((location) => {
    const matchProvince = !provinceFilter || location.province === provinceFilter;
    const matchRegency = !regencyFilter || location.regency === regencyFilter;
    const matchDistrict = !districtFilter || location.district === districtFilter;
    
    return matchProvince && matchRegency && matchDistrict;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleProvinceChange = (value: string) => {
    setProvinceFilter(value);
    // Reset filter lainnya ketika provinsi berubah
    setRegencyFilter("");
    setDistrictFilter("");
    setCurrentPage(1); // Reset ke halaman pertama
  };

  const handleRegencyChange = (value: string) => {
    setRegencyFilter(value);
    // Reset district filter ketika regency berubah
    setDistrictFilter("");
    setCurrentPage(1); // Reset ke halaman pertama
  };

  const handleDistrictChange = (value: string) => {
    setDistrictFilter(value);
    setCurrentPage(1); // Reset ke halaman pertama
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          visiblePages.push(i);
        }
        visiblePages.push('...');
        visiblePages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        visiblePages.push(1);
        visiblePages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        visiblePages.push(1);
        visiblePages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          visiblePages.push(i);
        }
        visiblePages.push('...');
        visiblePages.push(totalPages);
      }
    }
    
    return visiblePages;
  };

  const handleViewCCTV = (location: LocationData) => {
    router.push(`/cctv/${location.slug}`);
  };

  const handleViewDetail = (location: LocationData) => {
    setSelectedLocation(location);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedLocation(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400';
      case 'maintenance':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'offline':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header dengan Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Daftar Lokasi CCTV
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Kelola dan pantau lokasi CCTV di berbagai daerah
          </p>
        </div>
        
        {/* Filter Section */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-48">
            <Select
              options={provinceOptions}
              placeholder="Pilih Provinsi"
              onChange={handleProvinceChange}
              defaultValue={provinceFilter}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={regencyOptions}
              placeholder="Pilih Kabupaten/Kota"
              onChange={handleRegencyChange}
              defaultValue={regencyFilter}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={districtOptions}
              placeholder="Pilih Kecamatan"
              onChange={handleDistrictChange}
              defaultValue={districtFilter}
            />
          </div>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentData.map((location) => (
          <div
            key={location.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] dark:hover:shadow-lg"
          >
            <div className="space-y-3">
              {/* Nama Desa */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {location.village}
                </h3>
              </div>
              
              {/* Info Lokasi */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Kecamatan:</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {location.district}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Kab/Kota:</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {location.regency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Provinsi:</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {location.province}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">CCTV:</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {location.cctvCount} unit
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(location.status)}`}>
                    {location.status === 'active' ? 'Aktif' : location.status === 'maintenance' ? 'Maintenance' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewCCTV(location)}
                    disabled={location.status === 'offline'}
                    className="flex-1 rounded-lg bg-brand-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-brand-600 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Lihat CCTV
                  </button>
                  <button 
                    onClick={() => handleViewDetail(location)}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-gray-500/20 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Results Info */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredData.length)} dari {filteredData.length} lokasi
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-1">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Page Numbers */}
            {getVisiblePages().map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-500 dark:text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page as number)}
                    className={`flex items-center justify-center w-8 h-8 text-sm font-medium rounded-lg ${
                      currentPage === page
                        ? 'text-white bg-brand-500 border border-brand-500 hover:bg-brand-600'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </div>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mx-auto max-w-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-white/90">
              Tidak ada lokasi ditemukan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Coba ubah filter pencarian untuk melihat lokasi lainnya.
            </p>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedLocation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeDetailModal}></div>
          
          {/* Modal Content */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  Detail Lokasi CCTV
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedLocation.village}
                </p>
              </div>
              <button
                onClick={closeDetailModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Location Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nama Desa/Kelurahan
                    </label>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {selectedLocation.village}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Kecamatan
                    </label>
                    <p className="text-gray-800 dark:text-white/90">
                      {selectedLocation.district}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Kabupaten/Kota
                    </label>
                    <p className="text-gray-800 dark:text-white/90">
                      {selectedLocation.regency}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Provinsi
                    </label>
                    <p className="text-gray-800 dark:text-white/90">
                      {selectedLocation.province}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Jumlah CCTV
                    </label>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {selectedLocation.cctvCount} unit
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status Sistem
                    </label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(selectedLocation.status)}`}>
                      {selectedLocation.status === 'active' ? 'Aktif' : selectedLocation.status === 'maintenance' ? 'Maintenance' : 'Offline'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Maintenance Terakhir
                    </label>
                    <p className="text-gray-800 dark:text-white/90">
                      {new Date(selectedLocation.lastMaintenance).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Slug URL
                    </label>
                    <p className="text-gray-800 dark:text-white/90 font-mono text-sm">
                      /cctv/{selectedLocation.slug}
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                  Informasi Teknis
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-800 dark:text-white/90 mb-2">Resolusi</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">1080p HD</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-800 dark:text-white/90 mb-2">Storage</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">30 hari</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-800 dark:text-white/90 mb-2">Koneksi</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fiber Optik</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleViewCCTV(selectedLocation);
                    closeDetailModal();
                  }}
                  disabled={selectedLocation.status === 'offline'}
                  className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Lihat Live Stream
                </button>
                <button
                  onClick={closeDetailModal}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}