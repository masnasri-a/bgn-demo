"use client"
import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProvinsiDropdown from './dropdown/provinsi';
import KabupatenDropdown from './dropdown/kabupaten';
import KecamatanDropdown from './dropdown/kecamatan';
import { useKabupatenStore, useKecamatanStore, useKelurahanStore, useProvinceStore } from './dropdown/hook';
import KelurahanDropdown from './dropdown/kelurahan';


interface MapboxChartProps {
  className?: string;
  height?: string;
}



const MapboxChart: React.FC<MapboxChartProps> = ({ className = "", height = "400px" }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);
  const [geojson, setGeojson] = React.useState<any>(null);
  const [provinsiList, setProvinsiList] = React.useState<string[]>([]);
  const [selectedProvinsi, setSelectedProvinsi] = React.useState<string>("all");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [pointData, setPointData] = React.useState<any>(null);

  // Fetch geometry data on mount
  useEffect(() => {
    setIsLoading(true);
    fetch(URL_GEOMETRY)
      .then(res => res.json())
      .then(data => {
        setGeojson(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const { selected: selectedProv, setSelected: setSelectedProv } = useProvinceStore();
  const { selected: selectedKab, setSelected: setSelectedKab } = useKabupatenStore();
  const { selected: selectedKec, setSelected: setSelectedKec } = useKecamatanStore();
  const { selected: selectedKel, setSelected: setSelectedKel } = useKelurahanStore();

  // Fetch geojson and provinsi list
  let URL_GEOMETRY='https://bgn-be.anakanjeng.site/maps/geometry'
  let URL_POINT='https://bgn-be.anakanjeng.site/maps/centroid'
  // Mapbox logic

  useEffect(() => {
    if (!selectedProv) return;
    setIsLoading(true);
    const url_geo = `${URL_GEOMETRY}?kd_propinsi=${selectedProv?.kd_propinsi}`;
    const url_point = `${URL_POINT}?kd_propinsi=${selectedProv?.kd_propinsi}`;

    Promise.all([
      fetch(url_geo).then(res => res.json()),
      fetch(url_point).then(res => res.json())
    ])
      .then(([geoData, pointData]) => {
      setGeojson(geoData);
        setPointData(pointData);
      })
      .finally(() => setIsLoading(false));


  }, [selectedProv]);

  useEffect(() => {
    if (!selectedKab) return;
    setIsLoading(true);
    const url = `${URL_GEOMETRY}?kd_propinsi=${selectedProv?.kd_propinsi}&kd_kabupaten=${selectedKab?.kd_kabupaten}`;
    const url_point = `${URL_POINT}?kd_propinsi=${selectedProv?.kd_propinsi}&kd_kabupaten=${selectedKab?.kd_kabupaten}`;

    Promise.all([
      fetch(url).then(res => res.json()),
      fetch(url_point).then(res => res.json())
    ])
      .then(([geoData, pointData]) => {
        setGeojson(geoData);
        setPointData(pointData);
      })
      .finally(() => setIsLoading(false));
  }, [selectedKab]);

  useEffect(() => {
    if (!selectedKec) return;
    setIsLoading(true);
    const url = `${URL_GEOMETRY}?kd_propinsi=${selectedProv?.kd_propinsi}&kd_kabupaten=${selectedKab?.kd_kabupaten}&kd_kecamatan=${selectedKec?.kd_kecamatan}`;
    const url_point = `${URL_POINT}?kd_propinsi=${selectedProv?.kd_propinsi}&kd_kabupaten=${selectedKab?.kd_kabupaten}&kd_kecamatan=${selectedKec?.kd_kecamatan}`;

    Promise.all([
      fetch(url).then(res => res.json()),
      fetch(url_point).then(res => res.json())
    ])
      .then(([geoData, pointData]) => {
        setGeojson(geoData);
        setPointData(pointData);
      })
      .finally(() => setIsLoading(false));
  }, [selectedKec]);

  useEffect(() => {
    if (!selectedKel) return;
    setIsLoading(true);
    const url = `${URL_GEOMETRY}?kd_propinsi=${selectedProv?.kd_propinsi}&kd_kabupaten=${selectedKab?.kd_kabupaten}&kd_kecamatan=${selectedKec?.kd_kecamatan}&kd_kelurahan=${selectedKel?.kd_kelurahan}`;
    const url_point = `${URL_POINT}?kd_propinsi=${selectedProv?.kd_propinsi}&kd_kabupaten=${selectedKab?.kd_kabupaten}&kd_kecamatan=${selectedKec?.kd_kecamatan}&kd_kelurahan=${selectedKel?.kd_kelurahan}`;

    Promise.all([
      fetch(url).then(res => res.json()),
      fetch(url_point).then(res => res.json())
    ])
      .then(([geoData, pointData]) => {
        setGeojson(geoData);
        setPointData(pointData);
      })
      .finally(() => setIsLoading(false));
  }, [selectedKel]);

  useEffect(() => {
    if (!geojson || !mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API || 'YOUR_MAPBOX_ACCESS_TOKEN';

    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [113.9213, -0.7893], // Center Indonesia
      zoom: 4,
      projection: 'mercator'
    });
    mapRef.current = map;

    map.on('load', () => {
      setIsMapLoaded(true);
      // Add GeoJSON source
      map.addSource('indonesia-geometry', {
        type: 'geojson',
        data: geojson
      });
      // Add layer
      map.addLayer({
        id: 'indonesia-fill',
        type: 'fill',
        source: 'indonesia-geometry',
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.3
        }
      });
      map.addLayer({
        id: 'indonesia-outline',
        type: 'line',
        source: 'indonesia-geometry',
        paint: {
          'line-color': '#088',
          'line-width': 1
        }
      });

      map.addSource('points', {
        type: 'geojson',
        data: pointData
    });

    map.addLayer({
      id: 'points-layer',
      type: 'circle',
      source: 'points',
      paint: {
        'circle-radius': 8,
        'circle-color': '#3399ff'
      }
    });

    // Add minimalist popup on hover for points-layer
    let pointPopup: mapboxgl.Popup | null = null;
    map.on('mouseenter', 'points-layer', (e: any) => {
      map.getCanvas().style.cursor = 'pointer';
      const feature = e.features && e.features[0];
      if (!feature) return;
      const props = feature.properties;
      let html = `<div style="font-size:12px;min-width:80px;max-width:180px;padding:6px 10px;background:#fff;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.08);color:#222;">`;
      Object.keys(props).forEach(key => {
        html += `<div><b>${key}</b>: ${props[key]}</div>`;
      });
      html += '</div>';
      pointPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 12
      })
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map);
    });

    map.on('mouseleave', 'points-layer', () => {
      map.getCanvas().style.cursor = '';
      if (pointPopup) {
        pointPopup.remove();
        pointPopup = null;
      }
    });

      // Add popup on click
      map.on('click', 'indonesia-fill', (e: any) => {
        const feature = e.features && e.features[0];
        if (!feature) return;
        const props = feature.properties;
        let html = '<div style="font-size:13px;min-width:120px;max-width:220px;padding:8px 12px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);color:#222;">';
        Object.keys(props).forEach(key => {
          html += `<div style='margin-bottom:4px;'><b>${key}</b>: ${props[key]}</div>`;
        });
        html += '</div>';
        new mapboxgl.Popup({ closeButton: false, closeOnClick: true })
          .setLngLat(e.lngLat)
          .setHTML(html)
          .addTo(map);
      });

      // Zoom to geometry
      if ((window as any).turf && geojson) {
        try {
          const bbox = (window as any).turf.bbox(geojson);
          map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { padding: 40, duration: 1200 });
        } catch (e) {
          // fallback: do nothing
        }
      }
    });

    return () => {
      map.remove();
    };
  }, [geojson]);

  // Update filter and Jakarta layer when selectedProvinsi changes
  
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
      {/* <div className="mb-2 flex items-center gap-2 justify-end"> */}
        {/* <label htmlFor="provinsi" className="text-sm font-medium">Provinsi:</label> */}
        {/* <Select
          value={selectedProvinsi}
          onValueChange={setSelectedProvinsi}
        >
          <SelectTrigger className="w-[220px] h-[200px] border rounded px-2 py-1 text-sm">
            <SelectValue placeholder="Semua Provinsi" />
          </SelectTrigger>
          <SelectContent className='h-44'>
            <SelectItem value="all">Semua Provinsi</SelectItem>
            {provinsiList.sort().map(prov => (
              <SelectItem key={prov} value={prov}>{prov}</SelectItem>
            ))}
          </SelectContent>
        </Select> */}

        {/* <ProvinsiDropdown /> */}
        {/* <KabupatenDropdown /> */}
        {/* <KecamatanDropdown /> */}
        {/* <KelurahanDropdown /> */}
      {/* </div> */}
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '700px', position: 'relative' }}
        className="rounded-lg overflow-hidden border"
      >
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapboxChart;