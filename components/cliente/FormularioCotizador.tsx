"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import SelectorTamanos from "./SelectorTamanos";
import { Ubicacion } from "@/shared/types/ubicacion";
import { useCotizador } from "@/features/remitente/hooks/useCotizador";
import { SelectorOrigenGuardado } from "./SelectorOrigenGuardado";

const SearchBox = dynamic(
  () => import("@mapbox/search-js-react").then((mod) => mod.SearchBox),
  { ssr: false },
);

interface FormularioProps {
  origen: Ubicacion | null;
  setOrigen: (u: Ubicacion) => void;
  destino: Ubicacion | null;
  setDestino: (u: Ubicacion) => void;
  mapboxToken: string;
}

export default function FormularioCotizador({
  origen,
  setOrigen,
  destino,
  setDestino,
  mapboxToken,
}: FormularioProps) {
  const {
    origenTexto,
    setOrigenTexto,
    destinoTexto,
    setDestinoTexto,
    tamanoSeleccionado,
    setTamanoSeleccionado,
    isCotizando,
    cotizacion,
    setCotizacion,
    handleCotizar,
    handleSolicitarEnvio,
  } = useCotizador(origen, destino);

  const [usarOrigenGuardado, setUsarOrigenGuardado] = useState(false);

  const mapboxSearchTheme = {
    variables: {
      fontFamily: "inherit",
      borderRadius: "0.75rem",
      border: "1px solid #e2e8f0",
      boxShadow: "none",
      backgroundColor: "#f8fafc",
      unit: "13px",
    },
  };

  return (
    <div className="w-full lg:w-2/5 h-full bg-white border-r border-slate-200 p-6 flex flex-col shadow-xl z-10 overflow-y-auto lg:overflow-y-auto">
      <style>{`
        mapbox-search-box { width: 100% !important; }
        mapbox-search-box::part(input):focus { border-color: #f59e0b !important; box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2) !important; outline: none !important; }
      `}</style>

      <div className="mb-4 shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Cotizar envío
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Ingresá las direcciones para conocer la tarifa.
        </p>
      </div>

      <form onSubmit={handleCotizar} className="flex flex-col h-full gap-4">
        <div className="relative">
          <div className="absolute left-3.25 top-8 bottom-8 w-0.5 bg-slate-200 z-0"></div>

          {/* ORIGEN */}
          <div className="relative z-50 space-y-1 mb-3">
            <div className="flex items-center justify-between">
              <Label className="text-slate-900 text-sm font-bold flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs shadow-sm">
                  A
                </div>
                Dirección de Retiro
              </Label>
              <button
                type="button"
                onClick={() => {
                  setUsarOrigenGuardado(!usarOrigenGuardado);
                  setOrigen(null); // limpiar al cambiar de modo
                  setOrigenTexto("");
                  setCotizacion(null);
                }}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 underline underline-offset-2 transition-colors"
              >
                {usarOrigenGuardado
                  ? "Ingresar nueva dirección"
                  : "Usar dirección guardada"}
              </button>
            </div>

            <div className="ml-2 w-[calc(100%-8px)]">
              {usarOrigenGuardado ? (
                <SelectorOrigenGuardado
                  seleccionada={origen}
                  onSeleccionar={(ubicacion) => {
                    if (!ubicacion) return;
                    setOrigen(ubicacion);
                    setOrigenTexto(ubicacion.nombre);
                    setCotizacion(null);
                  }}
                />
              ) : (
                <SearchBox
                  accessToken={mapboxToken}
                  theme={mapboxSearchTheme}
                  options={{
                    language: "es",
                    country: "AR",
                    proximity: [-62.2663, -38.7183],
                  }}
                  placeholder="Buscar dirección de origen..."
                  value={origenTexto}
                  onChange={setOrigenTexto}
                  onRetrieve={(res) => {
                    if (res.features?.length > 0) {
                      const feat = res.features[0];
                      setOrigenTexto(feat.properties.name);
                      setOrigen({
                        nombre: feat.properties.name,
                        lng: feat.geometry.coordinates[0],
                        lat: feat.geometry.coordinates[1],
                      });
                      setCotizacion(null);
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* DESTINO */}
          <div className="relative z-40 space-y-1">
            <Label className="text-slate-900 text-sm font-bold flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 text-xs shadow-sm">
                B
              </div>
              Dirección de Entrega
            </Label>
            <div className="ml-2 w-[calc(100%-8px)]">
              <SearchBox
                accessToken={mapboxToken}
                theme={mapboxSearchTheme}
                options={{
                  language: "es",
                  country: "AR",
                  proximity: [-62.2663, -38.7183],
                }}
                placeholder="Buscar dirección de destino..."
                value={destinoTexto}
                onChange={setDestinoTexto}
                onRetrieve={(res) => {
                  if (res.features?.length > 0) {
                    const feat = res.features[0];
                    setDestinoTexto(feat.properties.name);
                    setDestino({
                      nombre: feat.properties.name,
                      lng: feat.geometry.coordinates[0],
                      lat: feat.geometry.coordinates[1],
                    });
                    setCotizacion(null);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* SELECTOR TAMAÑO */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <Label className="text-slate-900 font-bold">Tamaño del paquete</Label>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-28 border-2 border-dashed border-slate-200 rounded-2xl">
                <div className="w-6 h-6 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <SelectorTamanos
              tamanoSeleccionado={tamanoSeleccionado}
              onSelect={(id) => {
                setTamanoSeleccionado(id);
                setCotizacion(null);
              }}
            />
          </Suspense>
        </div>

        <div className="flex-1 min-h-0" />

        {/* BOTONES / COTIZACIÓN */}
        <div className="mt-auto pt-2 pb-4">
          {!cotizacion ? (
            <Button
              type="submit"
              disabled={isCotizando || !origen || !destino}
              className="w-full h-12 text-base font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 rounded-xl shadow-sm"
            >
              {isCotizando ? "Calculando ruta..." : "Cotizar Envío"}
            </Button>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 pb-2">
              <Card className="border-slate-900 bg-slate-900 text-white shadow-xl overflow-hidden rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                        Tarifa Final
                      </p>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-black">
                          ${cotizacion.precio}
                        </span>
                        <span className="text-slate-400 text-sm mb-1 font-medium">
                          ARS
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Llega en
                      </p>
                      <p className="text-lg font-bold text-white">
                        {cotizacion.eta}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleSolicitarEnvio}
                    type="button"
                    className="w-full h-11 text-base font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 rounded-xl shadow-md group"
                  >
                    Solicitar Envío{" "}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
