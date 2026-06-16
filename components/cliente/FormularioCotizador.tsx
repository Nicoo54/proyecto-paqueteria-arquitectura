"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Ubicacion } from "@/features/remitente/types";
import SelectorTamanos from "./SelectorTamanos";
import dynamic from "next/dynamic";

const SearchBox = dynamic(
  () => import("@mapbox/search-js-react").then((mod) => mod.SearchBox),
  { ssr: false },
);

// TODO: Cambiar por endpoint real cuando esté listo en el backend
const cotizarEnBackend = async (
  origen: Ubicacion,
  destino: Ubicacion,
  tamano: string,
) => {
  return new Promise<{ precio: number; eta: string; distancia: string }>(
    (resolve) => {
      setTimeout(
        () =>
          resolve({ precio: 1850.5, eta: "15-20 min", distancia: "3.2 km" }),
        1000,
      );
    },
  );
};

interface FormularioProps {
  origen: Ubicacion;
  setOrigen: (u: Ubicacion) => void;
  destino: Ubicacion;
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
  const router = useRouter();

  const [origenTexto, setOrigenTexto] = useState("");
  const [destinoTexto, setDestinoTexto] = useState("");

  const [tamanoSeleccionado, setTamanoSeleccionado] = useState<string>("S");
  const [isCotizando, setIsCotizando] = useState(false);
  const [cotizacion, setCotizacion] = useState<{
    precio: number;
    eta: string;
    distancia: string;
  } | null>(null);

  const handleCotizar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origen || !destino || !tamanoSeleccionado) return;
    setIsCotizando(true);
    setCotizacion(null);
    const resultado = await cotizarEnBackend(
      origen,
      destino,
      tamanoSeleccionado,
    );
    setCotizacion(resultado);
    setIsCotizando(false);
  };

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
    <div className="w-2/5 h-full bg-white border-r border-slate-200 p-6 flex flex-col shadow-xl z-10 overflow-y-hidden lg:overflow-y-auto xl:overflow-y-hidden">
      <style>{`
        mapbox-search-box { width: 100% !important; }
        mapbox-search-box::part(input):focus {
          border-color: #f59e0b !important;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2) !important;
          outline: none !important;
        }
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

          <div className="relative z-50 space-y-1 mb-3">
            <Label className="text-slate-900 text-sm font-bold flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs shadow-sm">
                A
              </div>
              Dirección de Retiro
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
                placeholder="Buscar dirección de origen..."
                value={origenTexto}
                onChange={(texto) => setOrigenTexto(texto)}
                onRetrieve={(res) => {
                  if (res.features?.length > 0) {
                    const feat = res.features[0];
                    const nombre = feat.properties.name;
                    setOrigenTexto(nombre); // Forzamos a que el texto se quede
                    setOrigen({
                      nombre,
                      lng: feat.geometry.coordinates[0],
                      lat: feat.geometry.coordinates[1],
                    });
                    setCotizacion(null);
                  }
                }}
              />
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
                onChange={(texto) => setDestinoTexto(texto)}
                onRetrieve={(res) => {
                  if (res.features?.length > 0) {
                    const feat = res.features[0];
                    const nombre = feat.properties.name;
                    setDestinoTexto(nombre); // Forzamos a que el texto se quede
                    setDestino({
                      nombre,
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
                <div className="w-6 h-6 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
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

        {/* COTIZACION */}
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
                    onClick={() => {
                      sessionStorage.setItem(
                        "draft_envio",
                        JSON.stringify({
                          origen,
                          destino,
                          tamanoSeleccionado,
                          cotizacion,
                        }),
                      );
                      router.push("/cliente/cotizar/resumen");
                    }}
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
