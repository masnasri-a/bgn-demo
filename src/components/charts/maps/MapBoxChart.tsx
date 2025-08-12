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
  const [jakartaGeojson, setJakartaGeojson] = React.useState<any>(null);

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

  // Fetch Jakarta geojson only when needed
  useEffect(() => {
    if (selectedProvinsi === 'DKI Jakarta' || selectedProvinsi === 'Jakarta') {
      fetch('https://cdn.jsdelivr.net/gh/masnasri-a/dir@main/jakarta%20(1).json')
        .then(res => res.json())
        .then(data => setJakartaGeojson(data));
    } else {
      setJakartaGeojson(null);
    }
  }, [selectedProvinsi]);

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
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [geojson]);

  // Update filter and Jakarta layer when selectedProvinsi changes
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;

    // Remove previous Jakarta layer/source if exists
    if (mapRef.current.getLayer('jakarta-point')) {
      mapRef.current.removeLayer('jakarta-point');
    }
    if (mapRef.current.getSource('jakarta')) {
      mapRef.current.removeSource('jakarta');
    }

    // Remove previous event listeners for popup

    if (selectedProvinsi === "all") {
      mapRef.current.setFilter('provinsi-layer', ['all']);
      mapRef.current.setFilter('provinsi-border', ['all']);

      // Enable provinsi click popup
      mapRef.current.on('click', 'provinsi-layer', (e: any) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const coordinates = e.lngLat;
        const props = feature.properties;
        // Build HTML for all properties
        const html = `<div style="min-width:160px;padding:10px 14px;background:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.08);font-family:inherit;">
          <div style="font-size:14px;font-weight:600;margin-bottom:6px;color:#222;">${props.PROVINSI || 'Provinsi'}</div>
          <table style="width:100%;font-size:13px;color:#444;border-collapse:collapse;">
            ${Object.entries(props).map(([k,v]) => `<tr><td style='padding:2px 8px 2px 0;color:#888;'>${k}</td><td style='padding:2px 0;font-weight:500;color:#222;'>${v}</td></tr>`).join('')}
          </table>
        </div>`;
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(html)
          .addTo(mapRef.current!);
      });
    } else if (selectedProvinsi === 'DKI Jakarta' || selectedProvinsi === 'Jakarta') {
      mapRef.current.setFilter('provinsi-layer', ['==', ['get', 'PROVINSI'], 'DKI Jakarta']);
      mapRef.current.setFilter('provinsi-border', ['==', ['get', 'PROVINSI'], 'DKI Jakarta']);
      const feature = geojson.features.find((f: any) => f.properties.PROVINSI === 'DKI Jakarta');
      if (feature) {
        const turf = (window as any).turf;
        if (turf) {
          const bbox = turf.bbox(feature);
          mapRef.current.fitBounds(bbox, { padding: 40 });
        }
      }

      // Add Jakarta source & layer
      if (jakartaGeojson) {
        mapRef.current.addSource('jakarta', {
          type: 'geojson',
          data: jakartaGeojson
        });
        mapRef.current.addLayer({
          id: 'jakarta-point',
          type: 'circle',
          source: 'jakarta',
          paint: {
            'circle-radius': 8,
            'circle-color': '#e11d48',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
          }
        });

        // Popup on hover
        let popup: mapboxgl.Popup | null = null;
        mapRef.current.on('mouseenter', 'jakarta-point', (e: any) => {
          if (mapRef.current) {
            mapRef.current.getCanvas().style.cursor = 'pointer';
          }
          if (!e.features || e.features.length === 0) return;
          const feature = e.features[0];
          const coordinates = feature.geometry.coordinates;
          const props = feature.properties;
          const html = `<div style="min-width:160px;padding:10px 14px;background:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.08);font-family:inherit; z-index:99999">
            <div style="font-size:14px;font-weight:600;margin-bottom:6px;color:#222;">${props.nm_kabupaten || 'Kabupaten'}</div>
            <table style="width:100%;font-size:13px;color:#444;border-collapse:collapse;">
              ${Object.entries(props).map(([k,v]) => `<tr><td style='padding:2px 8px 2px 0;color:#888;'>${k}</td><td style='padding:2px 0;font-weight:500;color:#222;'>${v}</td></tr>`).join('')}
            </table>
          </div>`;
          popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false })
            .setLngLat(coordinates)
            .setHTML(html)
            .addTo(mapRef.current!);
        });
        mapRef.current.on('mouseleave', 'jakarta-point', () => {
          if (mapRef.current) {
            mapRef.current.getCanvas().style.cursor = '';
          }
          if (popup) {
            popup.remove();
            popup = null;
          }
        });
      }
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
      // Enable provinsi click popup
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
    }
  }, [selectedProvinsi, geojson, isMapLoaded, jakartaGeojson]);

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
        style={{ width: '100%', height: '700px' }}
        className="rounded-lg overflow-hidden border"
      />
    </div>
  );
};

export default MapboxChart;