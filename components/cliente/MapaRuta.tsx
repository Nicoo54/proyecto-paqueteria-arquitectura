"use client";

import { useEffect, useRef } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Ubicacion } from "@/lib/cliente/types";

interface MapaRutaProps {
  origen: Ubicacion;
  destino: Ubicacion;
  geometriaRuta: any;
  mapboxToken: string;
}

export default function MapaRuta({
  origen,
  destino,
  geometriaRuta,
  mapboxToken,
}: MapaRutaProps) {
  const mapRef = useRef<any>(null);

  // Efecto de cámara (Auto-encuadre)
  useEffect(() => {
    if (!mapRef.current) return;

    if (origen && destino) {
      const minLng = Math.min(origen.lng, destino.lng);
      const minLat = Math.min(origen.lat, destino.lat);
      const maxLng = Math.max(origen.lng, destino.lng);
      const maxLat = Math.max(origen.lat, destino.lat);

      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: { top: 70, bottom: 70, left: 70, right: 70 },
          duration: 1500,
        },
      );
    } else if (origen) {
      mapRef.current.flyTo({
        center: [origen.lng, origen.lat],
        zoom: 14,
        duration: 1200,
      });
    } else if (destino) {
      mapRef.current.flyTo({
        center: [destino.lng, destino.lat],
        zoom: 14,
        duration: 1200,
      });
    }
  }, [origen, destino]);

  const routeGeoJSON: any = {
    type: "Feature",
    properties: {},
    geometry: geometriaRuta || { type: "LineString", coordinates: [] },
  };

  const routeLayerStyle: any = {
    id: "route-line",
    type: "line",
    layout: { "line-join": "round", "line-cap": "round" },
    paint: { "line-color": "#f59e0b", "line-width": 5 },
  };

  return (
    <div className="hidden lg:flex flex-1 relative bg-slate-200">
      {mapboxToken ? (
        <Map
          ref={mapRef}
          mapboxAccessToken={mapboxToken}
          initialViewState={{
            longitude: -62.2663,
            latitude: -38.7183,
            zoom: 12,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          style={{ width: "100%", height: "100%" }}
        >
          {geometriaRuta && (
            <Source id="route-source" type="geojson" data={routeGeoJSON}>
              <Layer {...routeLayerStyle} />
            </Source>
          )}

          {origen && (
            <Marker
              longitude={origen.lng}
              latitude={origen.lat}
              anchor="bottom"
            >
              <div className="relative group cursor-pointer">
                <div className="w-8 h-8 bg-slate-900 flex items-center justify-center rounded-full shadow-lg border-2 border-white relative z-10">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <div className="absolute w-2 h-2 bg-slate-900 rotate-45 -bottom-1 left-3 z-0"></div>
              </div>
            </Marker>
          )}

          {destino && (
            <Marker
              longitude={destino.lng}
              latitude={destino.lat}
              anchor="bottom"
            >
              <div className="relative group cursor-pointer">
                <div className="w-8 h-8 bg-amber-400 flex items-center justify-center rounded-full shadow-lg border-2 border-white relative z-10">
                  <span className="text-slate-900 text-xs font-bold">B</span>
                </div>
                <div className="absolute w-2 h-2 bg-amber-400 rotate-45 -bottom-1 left-3 z-0"></div>
              </div>
            </Marker>
          )}
        </Map>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-100">
          <p className="text-slate-500 font-medium">
            Falta el token de Mapbox en .env.local
          </p>
        </div>
      )}
    </div>
  );
}
