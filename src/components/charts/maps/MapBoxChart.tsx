"use client"
import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface MapboxChartProps {
  className?: string;
  height?: string;
}


const GEOJSON_URL = 'https://cdn.jsdelivr.net/gh/masnasri-a/dir@main/38%20Provinsi%20Indonesia%20-%20Provinsi.json';

const MapboxChart: React.FC<MapboxChartProps> = ({ className = "", height = "400px" }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);
  const [geojson, setGeojson] = React.useState<any>(null);
  const [provinsiList, setProvinsiList] = React.useState<string[]>([]);
  const [selectedProvinsi, setSelectedProvinsi] = React.useState<string>("all");

  // Fetch geojson and provinsi list
  useEffect(() => {
    fetch(GEOJSON_URL)
      .then(res => res.json())
      .then(data => {
        setGeojson(data);
        const provs = data.features.map((f: any) => f.properties.PROVINSI);
        setProvinsiList(provs);
      });
  }, []);

  // Mapbox logic
  useEffect(() => {
    if (!geojson || !mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API || 'YOUR_MAPBOX_ACCESS_TOKEN';

    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [113.9213, -0.7893], // Center Indonesia
      zoom: 4,
      projection: 'mercator'
    });

    mapRef.current.on('load', () => {
      if (!mapRef.current) return;

      // Add geojson source
      if (!mapRef.current.getSource('provinsi')) {
        mapRef.current.addSource('provinsi', {
          type: 'geojson',
          data: geojson
        });
      }

      // Add layer for provinsi
      if (!mapRef.current.getLayer('provinsi-layer')) {
        mapRef.current.addLayer({
          id: 'provinsi-layer',
          type: 'fill',
          source: 'provinsi',
          paint: {
            'fill-color': '#51bbd6',
            'fill-opacity': 0.5
          },
          filter: ['all']
        });
      }

      // Add border layer
      if (!mapRef.current.getLayer('provinsi-border')) {
        mapRef.current.addLayer({
          id: 'provinsi-border',
          type: 'line',
          source: 'provinsi',
          paint: {
            'line-color': '#333',
            'line-width': 1
          },
          filter: ['all']
        });
      }

      setIsMapLoaded(true);

      // Add click event for tooltip
      mapRef.current.on('click', 'provinsi-layer', (e: any) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const coordinates = e.lngLat;
        const props = feature.properties;
        // Build HTML for all properties
        const html = `<div style="min-width:180px;padding:8px 10px;">
          <h3 style="margin:0 0 6px 0;font-size:15px;font-weight:bold;">${props.PROVINSI || 'Provinsi'}</h3>
          <table style="font-size:13px;color:#444;">
            ${Object.entries(props).map(([k,v]) => `<tr><td style='padding-right:8px;'>${k}</td><td><b>${v}</b></td></tr>`).join('')}
          </table>
        </div>`;
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(html)
          .addTo(mapRef.current!);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [geojson]);

  // Update filter when selectedProvinsi changes
  useEffect(() => {
  if (!mapRef.current || !isMapLoaded) return;
  if (selectedProvinsi === "all") {
    mapRef.current.setFilter('provinsi-layer', ['all']);
    mapRef.current.setFilter('provinsi-border', ['all']);
  } else {
    mapRef.current.setFilter('provinsi-layer', ['==', ['get', 'PROVINSI'], selectedProvinsi]);
    mapRef.current.setFilter('provinsi-border', ['==', ['get', 'PROVINSI'], selectedProvinsi]);
    const feature = geojson.features.find((f: any) => f.properties.PROVINSI === selectedProvinsi);
    if (feature) {
      const turf = (window as any).turf;
      if (turf) {
        const bbox = turf.bbox(feature);
        mapRef.current.fitBounds(bbox, { padding: 40 });
      }
    }
  }
}, [selectedProvinsi, geojson, isMapLoaded]);

  // Load turf.js for bbox
  useEffect(() => {
    if (!(window as any).turf) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js';
      script.async = true;
      script.onload = () => {
        // turf loaded
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="mb-2 flex items-center gap-2 justify-end">
        <label htmlFor="provinsi" className="text-sm font-medium">Provinsi:</label>
        <Select
          value={selectedProvinsi}
          onValueChange={setSelectedProvinsi}
        >
          <SelectTrigger className="w-[220px] border rounded px-2 py-1 text-sm">
            <SelectValue placeholder="Semua Provinsi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Provinsi</SelectItem>
            {provinsiList.map(prov => (
              <SelectItem key={prov} value={prov}>{prov}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height }}
        className="rounded-lg overflow-hidden border"
      />
    </div>
  );
};

export default MapboxChart;