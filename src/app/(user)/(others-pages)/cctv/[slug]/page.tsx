"use client";
import React, { useState, useEffect } from 'react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useParams } from 'next/navigation';

interface CCTVData {
  id: string;
  name: string;
  location: string;
  embedUrl: string;
  status: 'online' | 'offline';
  slug: string;
}

const DetailCCTV = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedCCTV, setSelectedCCTV] = useState("");

  // Data CCTV dengan URL embed dan slug untuk routing
  const cctvData: CCTVData[] = [
    {
      id: "1",
      name: "Kamera Dapur Utama",
      location: "Dapur Lantai 1 - Area Memasak",
      embedUrl: "https://cctv.balitower.co.id/GBK_C10_04/embed.html",
      status: "online",
      slug: "dapur-utama"
    },
    {
      id: "2", 
      name: "Kamera Dapur Persiapan",
      location: "Dapur Lantai 1 - Area Persiapan",
      embedUrl: "https://cctv.balitower.co.id/Tomang-004-702108_2/embed.html",
      status: "online",
      slug: "dapur-persiapan"
    },
    {
      id: "3",
      name: "Kamera Ruang Cuci",
      location: "Dapur Lantai 1 - Area Pencucian", 
      embedUrl: "https://cctv.balitower.co.id/Cengkareng-Barat-013-702131_2/embed.html",
      status: "online",
      slug: "ruang-cuci"
    }
  ];

  // Find current CCTV based on slug from URL
  const currentCCTV = cctvData.find(cctv => cctv.slug === slug) || cctvData[0];
  
  // Find the CCTV to display (either selected or current from URL)
  const displayCCTV = cctvData.find(cctv => cctv.id === selectedCCTV) || currentCCTV;

  useEffect(() => {
    // Set selected CCTV based on URL slug only if not already selected
    if (currentCCTV && !selectedCCTV) {
      setSelectedCCTV(currentCCTV.id);
    }
  }, [slug, currentCCTV, selectedCCTV]);

  const handleCCTVSelect = (cctvId: string) => {
    setSelectedCCTV(cctvId);
    // Just update the selected CCTV without navigation
    // The video will change based on the selectedCCTV state
  };

  return (
    <div>
      <PageBreadcrumb pageTitle={`Detail CCTV - ${displayCCTV?.name || 'Loading...'}`} />
      
      <div className="space-y-6">
        {/* Header Info */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                {displayCCTV?.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {displayCCTV?.location}
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                URL: /cctv/{slug} | Current: {displayCCTV?.slug}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${displayCCTV?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${displayCCTV?.status === 'online' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {displayCCTV?.status === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Video Player - 8/12 */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Live Stream
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Streaming langsung dari kamera {displayCCTV.name}
                </p>
              </div>
              
              {/* Video Embed */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                {displayCCTV ? (
                  <iframe
                    key={displayCCTV.id} // Force re-render when CCTV changes
                    src={displayCCTV.embedUrl}
                    className="h-full w-full border-0"
                    allowFullScreen
                    title={`CCTV ${displayCCTV.name}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-brand-500"></div>
                      <p className="text-gray-500 dark:text-gray-400">Loading CCTV...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Video Controls Info */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Resolusi: Auto</span>
                <span>Kualitas: HD</span>
                <span>Showing: {displayCCTV?.name}</span>
                <button className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Fullscreen
                </button>
              </div>
            </div>
          </div>

          {/* CCTV List - 4/12 */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Daftar CCTV
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pilih kamera untuk melihat streaming
                </p>
              </div>

              {/* CCTV Cards */}
              <div className="space-y-3">
                {cctvData.map((cctv) => (
                  <div
                    key={cctv.id}
                    onClick={() => handleCCTVSelect(cctv.id)}
                    className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
                      selectedCCTV === cctv.id
                        ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/10'
                        : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Status Indicator */}
                      <div className="flex-shrink-0 pt-1">
                        <div className={`h-2 w-2 rounded-full ${cctv.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium truncate ${
                          selectedCCTV === cctv.id
                            ? 'text-brand-700 dark:text-brand-300'
                            : 'text-gray-800 dark:text-white/90'
                        }`}>
                          {cctv.name}
                        </h4>
                        <p className={`text-sm truncate ${
                          selectedCCTV === cctv.id
                            ? 'text-brand-600 dark:text-brand-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {cctv.location}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs font-medium ${
                            cctv.status === 'online'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {cctv.status === 'online' ? 'Online' : 'Offline'}
                          </span>
                          {selectedCCTV === cctv.id && (
                            <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                              • Sedang ditonton
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Selected Indicator */}
                      {selectedCCTV === cctv.id && (
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-brand-500 dark:text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <h4 className="text-sm font-medium text-gray-800 dark:text-white/90 mb-2">
                  Informasi
                </h4>
                <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <li>• Streaming 24/7</li>
                  <li>• Kualitas HD</li>
                  <li>• Dapat di fullscreen</li>
                  <li>• Auto refresh setiap 30 detik</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailCCTV;