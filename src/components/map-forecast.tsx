import { useState, useEffect, useRef, useCallback } from "react";
import maplibregl, { Map, Popup, LngLatLike, MapMouseEvent, MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// Import GeoJSON types for better compatibility with MapLibre's internal types
import {
  Feature as GeoJSONFeature,
  Point,
  Polygon,
  MultiPolygon,
  Geometry,
  GeoJsonProperties,
} from "geojson";

// --- Filters Type (Remains the same) ---
interface Filters {
  district: string;
  year: number;
  searchSchool?: string;
  categories?: {
    gov?: boolean;
    comfort?: boolean;
    private?: boolean;
  };
}

// --- FeatureProperties Type ---
// This will extend GeoJsonProperties for better compatibility
type CustomFeatureProperties = (GeoJsonProperties extends object ? GeoJsonProperties : object) & {
  district?: string;
  name_ru?: string;
  organization_name?: string;
  is_private?: boolean;
  education_type?: string;
  deficit?: number;
  surplus?: number;
  [key: `deficit_${number}`]: number | undefined;
  [key: `surplus_${number}`]: number | undefined;
  color?: string;
  statusText?: string;
  radius?: number;
  rating?: number;
}

// --- FeatureGeometry Type ---
// This needs to be compatible with GeoJSON Geometry types
type CustomFeatureGeometry = Point | Polygon | MultiPolygon;

// --- Feature Type ---
// Now using GeoJSONFeature with our custom properties and geometry
type Feature = GeoJSONFeature<CustomFeatureGeometry, CustomFeatureProperties>;

interface MapForecastProps {
  balanceData: Feature[];
  schoolsData: Feature[];
  filters: Filters;
  districtsData: Feature[]; // Assuming districts also follow the new Feature type
}

// --- Component ---
function MapForecast({
  balanceData,
  schoolsData,
  filters,
  districtsData,
}: MapForecastProps) {
  const [filteredData, setFilteredData] = useState<Feature[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<Feature[]>([]);
  const [mode, setMode] = useState<"polygons" | "schools">("polygons");
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const API_KEY = "9zZ4lJvufSPFPoOGi6yZ";

  // --- Filtering polygons ---
  useEffect(() => {
    const filtered = balanceData.filter((item) => {
      const matchesDistrict =
        filters.district === "Все районы" ||
        item.properties?.district === filters.district; // Use optional chaining for properties

      return matchesDistrict;
    });

    setFilteredData(filtered);
  }, [balanceData, filters]);

  // --- Filtering schools ---
  useEffect(() => {
    const fs = schoolsData.filter((school) => {
      const matchesDistrict =
        filters.district === "Все районы" ||
        school.properties?.district === filters.district; // Use optional chaining

      const matchesSearch =
        !filters.searchSchool ||
        (String(school.properties?.organization_name || "") // Optional chaining
          .toLowerCase()
          .includes(String(filters.searchSchool).toLowerCase()));

      const isPrivate = school.properties?.is_private === true; // Optional chaining
      const isComfort = school.properties?.education_type === "комфортная школа"; // Optional chaining
      const isGov = !isPrivate;

      const matchesCategories =
        (filters.categories?.gov && isGov) ||
        (filters.categories?.comfort && isComfort) ||
        (filters.categories?.private && isPrivate) ||
        (!filters.categories?.gov && !filters.categories?.comfort && !filters.categories?.private);

      return matchesDistrict && matchesSearch && matchesCategories;
    });
    setFilteredSchools(fs);
  }, [schoolsData, filters]);

  // --- Helpers ---
  const getStatusColor = useCallback(
    (item: Feature): string => {
      const year = filters.year;
      // Access properties safely, defaulting to 0 if undefined
      const deficit =
        (item.properties?.[`deficit_${year}`] as number | undefined) || // Use optional chaining for properties
        (item.properties?.deficit as number | undefined) ||
        0;
      const surplus =
        (item.properties?.[`surplus_${year}`] as number | undefined) || // Optional chaining
        (item.properties?.surplus as number | undefined) ||
        0;

      if (deficit > 0) return "#EF4444";
      if (surplus > 0) return "#10B981";
      return "#3B82F6";
    },
    [filters.year]
  );

  const getStatusText = useCallback(
    (item: Feature): string => {
      const year = filters.year;
      // Access properties safely, defaulting to 0 if undefined
      const deficit =
        (item.properties?.[`deficit_${year}`] as number | undefined) || // Optional chaining
        (item.properties?.deficit as number | undefined) ||
        0;
      const surplus =
        (item.properties?.[`surplus_${year}`] as number | undefined) || // Optional chaining
        (item.properties?.surplus as number | undefined) ||
        0;

      if (deficit > 0) return `Дефицит: ${deficit} мест`;
      if (surplus > 0) return `Профицит: ${surplus} мест`;
      return "Сбалансированная загрузка";
    },
    [filters.year]
  );

  // Store the actual click listener function in a ref to remove it later
  const schoolsClickListenerRef = useRef<((e: MapMouseEvent) => void) | null>(null);

  // --- Add Forecast Layer (Memoized with useCallback) ---
  const addForecastLayer = useCallback(
    (data: Feature[]) => {
      if (!map.current || !map.current.isStyleLoaded()) return;

      ["forecast-circles", "forecast-polygons", "schools-forecast"].forEach(
        (id) => {
          if (map.current?.getLayer(id)) map.current.removeLayer(id);
        }
      );
      ["forecast", "forecast-polygons", "schools-forecast"].forEach((id) => {
        if (map.current?.getSource(id)) map.current.removeSource(id);
      });

      if (mode === "polygons") {
        const asPolygons = data.filter(
          (f) =>
            f.geometry &&
            (f.geometry.type === "Polygon" ||
              f.geometry.type === "MultiPolygon")
        );
        map.current?.addSource("forecast-polygons", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: asPolygons.map((item) => ({
              type: "Feature",
              geometry: item.geometry,
              properties: {
                ...item.properties,
                color: getStatusColor(item),
                statusText: getStatusText(item),
              } as CustomFeatureProperties, // Assert properties type
            })),
          },
        });
        map.current?.addLayer({
          id: "forecast-polygons",
          type: "fill",
          source: "forecast-polygons",
          paint: {
            "fill-color": ["get", "color"],
            "fill-opacity": 0.35,
          },
        });
      } else {
        map.current?.addSource("schools-forecast", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: filteredSchools.map((s) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: s.geometry.coordinates as LngLatLike, // Type assertion here
              } as Point, // Assert Point type
              properties: {
                organization_name: s.properties?.organization_name, // Optional chaining
                district: s.properties?.district, // Optional chaining
                is_private: s.properties?.is_private, // Optional chaining
                education_type: s.properties?.education_type, // Optional chaining
                color: s.properties?.is_private === true // Optional chaining & Explicit comparison
                  ? "#3B82F6"
                  : s.properties?.education_type === "комфортная школа" // Optional chaining
                  ? "#F59E0B"
                  : "#10B981",
                radius: 8,
              } as CustomFeatureProperties, // Assert properties type
            })),
          },
        });
        map.current?.addLayer({
          id: "schools-forecast",
          type: "circle",
          source: "schools-forecast",
          paint: {
            "circle-radius": ["get", "radius"],
            "circle-color": ["get", "color"],
            "circle-stroke-color": ["get", "color"],
            "circle-stroke-width": 2,
            "circle-opacity": 0.8,
          },
        });
      }

      if (mode === "schools") {
        // Remove existing listener before adding a new one
        if (map.current && schoolsClickListenerRef.current) {
          map.current.off("click", "schools-forecast", schoolsClickListenerRef.current);
          schoolsClickListenerRef.current = null;
        }

        const newClickListener = (e: MapLayerMouseEvent) => {
          if (!e.features || !e.features.length) return;
          const feature = e.features[0];

          // Safely access properties with type guards or assertions
          const properties = feature.properties as CustomFeatureProperties;
          const { organization_name, district, rating, education_type } = properties;

          // Ensure coordinates are of the expected type LngLatLike for a Point
          const pointGeometry = feature.geometry as Point;
          const coordinates = pointGeometry.coordinates as LngLatLike;

          // Build popup content
          const content = `
            <div style="font-family:sans-serif;font-size:14px; color:black;">
              <strong>${organization_name || "Школа"}</strong><br/>
              Район: ${district || "—"}<br/>
              Тип: ${education_type || "—"}<br/>
              Рейтинг: ${rating ?? "—"}
            </div>
          `;
          new Popup({ closeButton: true, closeOnClick: true })
            .setLngLat(coordinates)
            .setHTML(content)
            .addTo(map.current!);
        };

        map.current?.on("click", "schools-forecast", newClickListener);
        schoolsClickListenerRef.current = newClickListener; // Store the listener

        // Optional: change cursor on hover
        map.current?.on("mouseenter", "schools-forecast", () => {
          map.current!.getCanvas().style.cursor = "pointer";
        });
        map.current?.on("mouseleave", "schools-forecast", () => {
          map.current!.getCanvas().style.cursor = "";
        });
      }
    },
    [mode, filteredSchools, getStatusColor, getStatusText] // Dependencies for useCallback
  );

  // --- Init Map ---
  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current as HTMLDivElement,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${API_KEY}`,
      center: [76.889709, 43.238949],
      zoom: 11,
    });

    map.current.on("load", () => {
      if (districtsData.length > 0) {
        map.current?.addSource("districts", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: districtsData.map((district) => ({
              type: "Feature",
              geometry: district.geometry,
              properties: {
                name: district.properties?.name_ru, // Optional chaining
                ...(district.properties || {}), // Ensure properties is an object
              } as CustomFeatureProperties, // Assert properties type
            })),
          },
        });

        map.current?.addLayer({
          id: "districts-fill",
          type: "fill",
          source: "districts",
          paint: {
            "fill-color": "#f3f4f6",
            "fill-opacity": 0.3,
          },
        });

        map.current?.addLayer({
          id: "districts-border",
          type: "line",
          source: "districts",
          paint: {
            "line-color": "#6b7280",
            "line-width": 1,
          },
        });

        map.current?.addLayer({
          id: "districts-labels",
          type: "symbol",
          source: "districts",
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["Open Sans Regular"],
            "text-size": 12,
            "text-anchor": "center",
          },
          paint: {
            "text-color": "#374151",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1,
          },
        });
      }

      if (balanceData.length > 0) {
        addForecastLayer(balanceData);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [districtsData, balanceData, addForecastLayer]);

  // --- Update Layers ---
  useEffect(() => {
    if (!map.current) return;
    const m = map.current;

    const update = () => addForecastLayer(filteredData);

    if (m.isStyleLoaded()) {
      update();
    } else {
      m.once("idle", update); // ensures style and sources are ready
    }

    // Cleanup: remove the event listener when the component unmounts
    // or if dependencies change and a new listener is to be added.
    return () => {
      m.off("idle", update);
      // Also, explicitly remove click handlers for schools-forecast if mode changes
      // to avoid multiple handlers on the same layer.
      if (map.current && schoolsClickListenerRef.current) {
        map.current.off("click", "schools-forecast", schoolsClickListenerRef.current);
        schoolsClickListenerRef.current = null;
      }
    };
  }, [filteredData, filteredSchools, filters.year, mode, addForecastLayer]);

  return (
    <div className="rounded-xl p-4">
      <h3 className="mb-2 text-[#1e293b]">Карта прогноза загруженности ({filters.year})</h3>
      <div className="w-full rounded-lg overflow-hidden border border-[#e2e8f0]">
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "8px",
            borderBottom: "1px solid #e5e7eb",
            background: "#fafafa",
          }}
        >
          <button
            className="bg-[#3b82f6] text-white p-2 rounded-sm coursor-pointer transition-all duration-200ms hover:bg-[#2563eb] active:bg-[#1d4ed8]"
            onClick={() => setMode("polygons")}
            style={{
              backgroundColor: mode === "polygons" ? "#1d4ed8" : "#3b82f6",
            }}
          >
            Полигоны
          </button>
          <button
            className="bg-[#3b82f6] text-white p-2 rounded-sm coursor-pointer transition-all duration-200ms hover:bg-[#2563eb] active:bg-[#1d4ed8]"
            onClick={() => setMode("schools")}
            style={{
              backgroundColor: mode === "schools" ? "#1d4ed8" : "#3b82f6",
            }}
          >
            Школы
          </button>
        </div>
        <div ref={mapContainer} style={{ height: "500px", width: "100%" }} />
      </div>

      <div className="mt-4 p-4 bg-[#f8fafc] rounded-sm text-sm">
        <h4 className="text-[#1e293b]">Легенда прогноза</h4>
        <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-8 mb-4 mt-4">
          <div className="flex items-center gap-2 text-[#1e293b]">
            <div
              className="w-[16px] h-[16px] bg-[#EF4444] rounded-full"
            ></div>
            <span>Дефицит мест</span>
          </div>
          <div className="flex items-center gap-2 text-[#1e293b]">
            <div
              className="w-[16px] h-[16px] bg-[#10B981] rounded-full"
            ></div>
            <span>Профицит мест</span>
          </div>
          <div className="flex items-center gap-2 text-[#1e293b]">
            <div
              className="w-[16px] h-[16px] bg-[#3B82F6] rounded-full"
            ></div>
            <span>Сбалансированная загрузка</span>
          </div>
        </div>
        <p className="text-[#6b7280] italic">
          Размер круга зависит от величины дефицита/профицита
        </p>
      </div>
    </div>
  );
}

export default MapForecast;