"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation, ArrowRight } from "lucide-react";
// IMPORTANTE: Esto es obligatorio para que el mapa no se vea roto
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "react-map-gl/mapbox";

// --- SIMULACIONES DE APIS ---
type TamanoPaquete = { id: string; label: string; desc: string; icon: string };

const fetchTamanosPaquetes = async () => {
  return new Promise<TamanoPaquete[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "S", label: "Pequeño", desc: "Llaves, doc.", icon: "✉️" },
        { id: "M", label: "Mediano", desc: "Caja zapatos", icon: "📦" },
        { id: "L", label: "Grande", desc: "Mochila", icon: "🛍️" },
      ]);
    }, 400);
  });
};

const cotizarEnBackend = async (
  origen: string,
  destino: string,
  tamano: string,
) => {
  return new Promise<{ precio: number; eta: string; distancia: string }>(
    (resolve) => {
      setTimeout(() => {
        resolve({ precio: 1850.5, eta: "15-20 min", distancia: "3.2 km" });
      }, 1000);
    },
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function CotizarPage() {
  const router = useRouter();

  // Estados
  const [tamanos, setTamanos] = useState<TamanoPaquete[]>([]);
  const [isLoadingTamanos, setIsLoadingTamanos] = useState(true);

  // Formulario
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [tamanoSeleccionado, setTamanoSeleccionado] = useState<string>("");

  // Cotización
  const [isCotizando, setIsCotizando] = useState(false);
  const [cotizacion, setCotizacion] = useState<{
    precio: number;
    eta: string;
    distancia: string;
  } | null>(null);

  // Cargar tamaños
  useEffect(() => {
    fetchTamanosPaquetes().then((data) => {
      setTamanos(data);
      setTamanoSeleccionado(data[0].id);
      setIsLoadingTamanos(false);
    });
  }, []);

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

  const handleSolicitarEnvio = () => {
    alert("¡Envío solicitado con éxito! Redirigiendo al tracking...");
    router.push("/cliente");
  };

  // Variable de entorno de Mapbox (Evita que crashee si no hay token)
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  return (
    // CONTENEDOR PRINCIPAL: h exacto, sin overflow
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 overflow-hidden">
      {/* PANEL IZQUIERDO: FORMULARIO APRETADO PARA QUE ENTRE SIN SCROLL */}
      <div className="w-full lg:w-112.5 xl:w-125 h-full bg-white border-r border-slate-200 p-6 flex flex-col shadow-xl z-10 overflow-y-auto lg:overflow-hidden">
        <div className="mb-4">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Cotizar envío
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Ingresá las direcciones para conocer la tarifa.
          </p>
        </div>

        <form onSubmit={handleCotizar} className="flex flex-col flex-1 gap-4">
          {/* SECCIÓN 1: DIRECCIONES */}
          <div className="relative">
            <div className="absolute left-3.25 top-8 bottom-8 w-0.5 bg-slate-200 z-0"></div>

            <div className="relative z-10 space-y-1 mb-3">
              <Label className="text-slate-900 text-sm font-bold flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs shadow-sm">
                  A
                </div>
                Dirección de Retiro
              </Label>
              <Input
                placeholder="Ej: Mitre 150, Bahía Blanca"
                required
                value={origen}
                onChange={(e) => {
                  setOrigen(e.target.value);
                  setCotizacion(null);
                }}
                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-amber-500 ml-2 w-[calc(100%-8px)]"
              />
            </div>

            <div className="relative z-10 space-y-1">
              <Label className="text-slate-900 text-sm font-bold flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 text-xs shadow-sm">
                  B
                </div>
                Dirección de Entrega
              </Label>
              <Input
                placeholder="Ej: Alem 1253, Bahía Blanca"
                required
                value={destino}
                onChange={(e) => {
                  setDestino(e.target.value);
                  setCotizacion(null);
                }}
                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-amber-500 ml-2 w-[calc(100%-8px)]"
              />
            </div>
          </div>

          {/* SECCIÓN 2: TAMAÑO DEL PAQUETE */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <Label className="text-slate-900 text-sm font-bold">
              Tamaño del paquete
            </Label>

            {isLoadingTamanos ? (
              <div className="flex items-center justify-center h-20 border-2 border-dashed border-slate-200 rounded-xl">
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {tamanos.map((tam) => (
                  <button
                    key={tam.id}
                    type="button"
                    onClick={() => {
                      setTamanoSeleccionado(tam.id);
                      setCotizacion(null);
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-200 ${
                      tamanoSeleccionado === tam.id
                        ? "border-slate-900 bg-slate-900 text-white shadow-md"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xl mb-1">{tam.icon}</span>
                    <span className="font-bold text-xs">{tam.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ESPACIO FLEXIBLE PARA EMPUJAR BOTONES ABAJO */}
          <div className="flex-1" />

          {/* BOTÓN CALCULAR */}
          {!cotizacion && (
            <Button
              type="submit"
              disabled={isCotizando || !origen || !destino}
              className="w-full h-12 text-base font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 rounded-xl shadow-sm"
            >
              {isCotizando ? "Calculando ruta..." : "Cotizar Envío"}
            </Button>
          )}

          {/* SECCIÓN 3: RESULTADO DE LA COTIZACIÓN */}
          {cotizacion && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
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
                    className="w-full h-11 text-base font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 rounded-xl shadow-md group"
                  >
                    Solicitar Envío
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </form>
      </div>

      {/* PANEL DERECHO: MAPA DE MAPBOX REAL */}
      <div className="hidden lg:flex flex-1 relative bg-slate-200">
        {mapboxToken ? (
          <Map
            mapboxAccessToken={mapboxToken}
            initialViewState={{
              longitude: -62.2663, // Coordenadas de Bahía Blanca
              latitude: -38.7183,
              zoom: 13,
            }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            style={{ width: "100%", height: "100%" }}
          >
            {/* Acá después vas a poder poner los <Marker> cuando tengas coordenadas reales */}
          </Map>
        ) : (
          // Placeholder por si el token es falso o no está
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <p className="text-slate-400 font-medium">
              Mapbox: Faltan credenciales en .env.local
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
