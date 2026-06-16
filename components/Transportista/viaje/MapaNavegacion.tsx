"use client";

import { forwardRef } from "react";
import Map, { Marker, Source, Layer, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Coordenada } from "@/features/transportista/viaje/types";

interface Props {
  mapboxToken: string;
  ubicacionPropia: Coordenada | null;
  destino: Coordenada;
  geometriaRuta: GeoJSON.LineString | null;
}

export const MapaNavegacion = forwardRef<MapRef, Props>(function MapaNavegacion(
  { mapboxToken, ubicacionPropia, destino, geometriaRuta },
  ref,
) {
  const routeGeoJSON: GeoJSON.Feature = {
    type: "Feature",
    properties: {},
    geometry: geometriaRuta || { type: "LineString", coordinates: [] },
  };

  if (!mapboxToken) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
        <p className="text-slate-500 font-medium">Falta el token de Mapbox</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <Map
        ref={ref}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: ubicacionPropia?.lng ?? destino.lng,
          latitude: ubicacionPropia?.lat ?? destino.lat,
          zoom: 15,
          pitch: 45,
        }}
        mapStyle="mapbox://styles/mapbox/navigation-day-v1"
        style={{ width: "100%", height: "100%" }}
      >
        {geometriaRuta && (
          <Source id="ruta" type="geojson" data={routeGeoJSON}>
            <Layer
              id="ruta-line"
              type="line"
              layout={{ "line-join": "round", "line-cap": "round" }}
              paint={{ "line-color": "#f59e0b", "line-width": 5 }}
            />
          </Source>
        )}

        <Marker longitude={destino.lng} latitude={destino.lat} anchor="bottom">
          <div className="relative">
            <div className="w-8 h-8 bg-emerald-500 flex items-center justify-center rounded-full shadow-lg border-2 border-white z-10">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <div className="absolute w-2 h-2 bg-emerald-500 rotate-45 -bottom-1 left-3" />
          </div>
        </Marker>

        {ubicacionPropia && (
          <Marker
            longitude={ubicacionPropia.lng}
            latitude={ubicacionPropia.lat}
            anchor="center"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-10 h-10 bg-amber-400/40 rounded-full animate-ping" />
              <div className="w-9 h-9 bg-slate-900 rounded-full flex items-center justify-center shadow-xl border-2 border-white z-10 text-lg">
                🛵
              </div>
            </div>
          </Marker>
        )}
      </Map>
    </div>
  );
});
