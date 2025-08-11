"use client"
import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxChartProps {
  className?: string;
  height?: string;
}

const MapboxChart: React.FC<MapboxChartProps> = ({ className = "", height = "400px" }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Set the access token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API || 'YOUR_MAPBOX_ACCESS_TOKEN';
    
    if (!mapContainerRef.current) return;

    // Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11', // Light style for better readability
      center: [106.8456, -6.2088], // Jakarta coordinates (longitude, latitude)
      zoom: 5, // Zoom level to show Indonesia
      projection: 'mercator' // Map projection
    });

    // Wait for the map to load
    mapRef.current.on('load', () => {
      if (!mapRef.current) return;
      
      // Add earthquake data source
      mapRef.current.addSource('earthquakes', {
        type: 'geojson',
        data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });

      // Add cluster layer
      mapRef.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        paint: {
          // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      // Add cluster count layer
      mapRef.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      // Add unclustered point layer
      mapRef.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'earthquakes',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });

      // Inspect a cluster on click
      mapRef.current.on('click', 'clusters', (e) => {
        if (!mapRef.current) return;
        
        const features = mapRef.current.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        
        const clusterId = features[0].properties?.cluster_id;
        const source = mapRef.current.getSource('earthquakes') as mapboxgl.GeoJSONSource;
        
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !mapRef.current || zoom === null || zoom === undefined) return;

          mapRef.current.easeTo({
            center: (features[0].geometry as any).coordinates,
            zoom: zoom
          });
        });
      });

      // Show popup on unclustered point click
      mapRef.current.on('click', 'unclustered-point', (e) => {
        if (!mapRef.current || !e.features || e.features.length === 0) return;
        
        const coordinates = (e.features[0].geometry as any).coordinates.slice();
        const mag = e.features[0].properties?.mag;
        const tsunami = e.features[0].properties?.tsunami;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">Earthquake Data</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">
                Magnitude: <strong>${mag}</strong><br>
                Tsunami: <strong>${tsunami === 1 ? 'Yes' : 'No'}</strong>
              </p>
            </div>
          `)
          .addTo(mapRef.current);
      });

      // Change cursor on hover
      mapRef.current.on('mouseenter', 'clusters', () => {
        if (mapRef.current) {
          mapRef.current.getCanvas().style.cursor = 'pointer';
        }
      });

      mapRef.current.on('mouseleave', 'clusters', () => {
        if (mapRef.current) {
          mapRef.current.getCanvas().style.cursor = '';
        }
      });

      mapRef.current.on('mouseenter', 'unclustered-point', () => {
        if (mapRef.current) {
          mapRef.current.getCanvas().style.cursor = 'pointer';
        }
      });

      mapRef.current.on('mouseleave', 'unclustered-point', () => {
        if (mapRef.current) {
          mapRef.current.getCanvas().style.cursor = '';
        }
      });
    });

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Info indicator */}
      {/* <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 text-xs font-medium shadow-sm">
        Earthquake Data Clustering
      </div> */}
      
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height }} 
        className="rounded-lg overflow-hidden border"
      />
    </div>
  );
};

export default MapboxChart