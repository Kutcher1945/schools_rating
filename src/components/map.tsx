'use client'

import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  className?: string;
}

export default function Map({
  center = [76.8887, 43.2389], // default: Almaty
  zoom = 10,
  className = "w-full h-[600px]",
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const API_KEY = "9zZ4lJvufSPFPoOGi6yZ";

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Initialize map
    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${API_KEY}`,
      center,
      zoom,
    });

    // Add navigation controls (zoom in/out)
    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  return <div ref={mapContainer} className={className} />;
}
