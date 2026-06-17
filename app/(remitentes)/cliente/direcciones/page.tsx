"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookmarkPlus, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

// Agregamos Map y Marker
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAgregarDireccion } from "@/features/remitente/hooks/useAgregarDireccion";

const SearchBox = dynamic(
  () => import("@mapbox/search-js-react").then((mod) => mod.SearchBox),
  { ssr: false },
);

export default function AgregarDireccionPage() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  const {
    searchText,
    setSearchText,
    direccionLista,
    handleSeleccionMapbox,
    limpiarSeleccion,
    isSaving,
    error,
    guardar,
    router,
  } = useAgregarDireccion();

  const mapboxSearchTheme = {
    variables: {
      fontFamily: "inherit",
      borderRadius: "0.75rem",
      border: "1px solid #e2e8f0",
      boxShadow: "none",
      backgroundColor: "#f8fafc",
      unit: "14px",
    },
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <style>{`
        mapbox-search-box { width: 100% !important; }
        mapbox-search-box::part(input):focus { border-color: #f59e0b !important; box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2) !important; outline: none !important; }
      `}</style>

      <button
        onClick={() => router.back()}
        className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Guardar Dirección <BookmarkPlus className="w-6 h-6 text-amber-500" />
        </h1>
        <p className="text-slate-500 mt-1">
          Buscá y guardá tus direcciones frecuentes para agilizar tus próximas
          cotizaciones.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={guardar} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">
                Buscar en el mapa
              </label>
              <SearchBox
                accessToken={mapboxToken}
                theme={mapboxSearchTheme}
                options={{
                  language: "es",
                  country: "AR",
                  proximity: [-62.2663, -38.7183],
                }}
                placeholder="Ej: Mitre 150, Bahía Blanca"
                value={searchText}
                onChange={(t) => {
                  setSearchText(t);
                  if (direccionLista) limpiarSeleccion();
                }}
                onRetrieve={(res) => {
                  if (res.features?.length > 0)
                    handleSeleccionMapbox(res.features[0]);
                }}
              />
              {error && (
                <p className="text-xs text-rose-500 font-bold mt-1">{error}</p>
              )}
            </div>

            {/* CONFIRMACIÓN VISUAL Y MINIMAPA */}
            {direccionLista && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-0.5">
                      Dirección validada
                    </p>
                    <p className="font-bold text-slate-900">
                      {direccionLista.direccion}
                    </p>
                    {direccionLista.ciudad && (
                      <p className="text-xs text-slate-500 font-medium">
                        {direccionLista.ciudad}
                      </p>
                    )}
                  </div>
                </div>

                {/* Minimapa de Confirmación */}
                {mapboxToken && (
                  <div className="h-48 w-full rounded-xl overflow-hidden border border-slate-200 relative shadow-inner">
                    <Map
                      mapboxAccessToken={mapboxToken}
                      initialViewState={{
                        longitude: direccionLista.origen_lng,
                        latitude: direccionLista.origen_lat,
                        zoom: 16,
                      }}
                      mapStyle="mapbox://styles/mapbox/streets-v12"
                      style={{ width: "100%", height: "100%" }}
                    >
                      <Marker
                        longitude={direccionLista.origen_lng}
                        latitude={direccionLista.origen_lat}
                        anchor="bottom"
                      >
                        <div className="relative group cursor-pointer">
                          <div className="w-8 h-8 bg-slate-900 flex items-center justify-center rounded-full shadow-lg border-2 border-white relative z-10">
                            <span className="text-white text-xs font-bold">
                              📍
                            </span>
                          </div>
                          <div className="absolute w-2 h-2 bg-slate-900 rotate-45 -bottom-1 left-3 z-0"></div>
                        </div>
                      </Marker>
                    </Map>
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSaving || !direccionLista}
              className="w-full h-14 text-lg font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-md transition-all mt-4"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Guardando...
                </div>
              ) : (
                "Guardar en mis direcciones"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
