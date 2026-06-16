"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Star,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import HeaderTracking from "@/components/cliente/tracking/HeaderTracking";
import { EnvioDB } from "@/features/remitente/types/envios";

const fetchEnvio = async (id: string): Promise<EnvioDB> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        codigo_envio: id,
        estado: "ENTREGADO",
        origen_direccion: "Mitre 150, Bahía Blanca",
        origen_lat: -38.7183,
        origen_lng: -62.2663,
        destino_direccion: "Alem 1253, Bahía Blanca",
        destino_lat: -38.6983,
        destino_lng: -62.2463,
        chofer: {
          nombre: "Carlos M.",
          vehiculo: "Honda Titan 150cc",
          rating: 4.8,
        },
      });
    }, 800);
  });
};

// 2. LE DECIMOS A TYPESCRIPT QUE PARAMS ES UNA PROMESA
export default function TrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 3. "DESENVOLVEMOS" LOS PARAMS USANDO React.use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
  const mapRef = useRef<any>(null);

  const [envio, setEnvio] = useState<EnvioDB | null>(null);
  const [ubicacionMoto, setUbicacionMoto] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [wsStatus, setWsStatus] = useState<
    "Conectando..." | "En vivo" | "Estatico"
  >("Conectando...");
  const [isCardCollapsed, setIsCollapsed] = useState(false);

  // 4. USAMOS LA VARIABLE 'id' LIMPIA
  useEffect(() => {
    fetchEnvio(id).then((data) => {
      setEnvio(data);
      setUbicacionMoto({ lat: data.origen_lat, lng: data.origen_lng });
    });
  }, [id]);

  useEffect(() => {
    if (!envio) return;

    if (envio.estado !== "EN_CAMINO") {
      setWsStatus("Estatico");
      return;
    }

    setWsStatus("En vivo");

    const wsMockInterval = setInterval(() => {
      setUbicacionMoto((prev) => {
        if (!prev) return prev;
        const step = 0.05;
        const newLat = prev.lat + (envio.destino_lat - prev.lat) * step;
        const newLng = prev.lng + (envio.destino_lng - prev.lng) * step;

        if (mapRef.current) {
          mapRef.current.flyTo({ center: [newLng, newLat], duration: 2000 });
        }

        return { lat: newLat, lng: newLng };
      });
    }, 3000);

    return () => clearInterval(wsMockInterval);
  }, [envio]);

  if (!envio || !ubicacionMoto) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const esEnCamino = envio.estado === "EN_CAMINO";

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-200">
      {/* 1. MAPA */}
      {mapboxToken ? (
        <div className="absolute inset-0 z-0">
          <Map
            ref={mapRef}
            mapboxAccessToken={mapboxToken}
            initialViewState={{
              longitude: esEnCamino ? ubicacionMoto.lng : envio.origen_lng,
              latitude: esEnCamino ? ubicacionMoto.lat : envio.origen_lat,
              zoom: 14.5,
              pitch: esEnCamino ? 45 : 0,
            }}
            mapStyle="mapbox://styles/mapbox/navigation-day-v1"
            style={{ width: "100%", height: "100%" }}
          >
            {!esEnCamino && (
              <Marker
                longitude={envio.origen_lng}
                latitude={envio.origen_lat}
                anchor="bottom"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-slate-900 flex items-center justify-center rounded-full shadow-lg border-2 border-white relative z-10">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <div className="absolute w-2 h-2 bg-slate-900 rotate-45 -bottom-1 left-3 z-0"></div>
                </div>
              </Marker>
            )}

            <Marker
              longitude={envio.destino_lng}
              latitude={envio.destino_lat}
              anchor="bottom"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-emerald-500 flex items-center justify-center rounded-full shadow-lg border-2 border-white relative z-10">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div className="absolute w-2 h-2 bg-emerald-500 rotate-45 -bottom-1 left-3 z-0"></div>
              </div>
            </Marker>

            {esEnCamino && (
              <Marker
                longitude={ubicacionMoto.lng}
                latitude={ubicacionMoto.lat}
                anchor="center"
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 bg-amber-400/40 rounded-full animate-ping" />
                  <div className="absolute w-8 h-8 bg-amber-400/60 rounded-full animate-pulse" />
                  <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center shadow-xl border-2 border-white z-10 text-lg">
                    🛵
                  </div>
                </div>
              </Marker>
            )}
          </Map>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <p className="text-slate-500 font-medium">
            Falta el token de Mapbox en .env.local
          </p>
        </div>
      )}

      <HeaderTracking esEnCamino={esEnCamino} />

      <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none z-10">
        <div className="max-w-md mx-auto pointer-events-auto transition-transform duration-300 ease-in-out">
          <Card className="border-slate-200 shadow-2xl rounded-3xl overflow-hidden bg-white/95 backdrop-blur-md relative">
            <button
              onClick={() => setIsCollapsed(!isCardCollapsed)}
              className="absolute right-4 top-3 z-20 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
            >
              {isCardCollapsed ? <GeocoderUpIcon /> : <GeocoderDownIcon />}
            </button>

            <CardContent className="p-0">
              <div className="bg-slate-900 text-white p-5 pr-14">
                {esEnCamino ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                        Estado del envío
                      </p>
                      <h2 className="text-xl font-black tracking-tight">
                        En camino al destino
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Llega en
                      </p>
                      <p className="text-2xl font-bold text-white">~8 min</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                      Buscando transportista
                    </p>
                    <h2 className="text-xl font-black tracking-tight animate-pulse">
                      Asignando un chofer...
                    </h2>
                  </div>
                )}
              </div>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isCardCollapsed ? "max-h-0" : "max-h-96"}`}
              >
                {esEnCamino && envio.chofer ? (
                  <div className="p-5 flex items-center gap-4 border-b border-slate-100 bg-white">
                    <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center text-xl border border-slate-200">
                      🛵
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {envio.chofer.nombre}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                        <span>{envio.chofer.vehiculo}</span>
                        <span>•</span>
                        <span className="flex items-center text-amber-500">
                          <Star className="w-3 h-3 fill-amber-500 mr-0.5" />{" "}
                          {envio.chofer.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 border-b border-slate-100 bg-white flex items-center gap-3 text-sm text-slate-500 font-medium">
                    <Clock className="w-4 h-4 text-amber-500 animate-spin" />
                    <span>
                      Tu envío ya fue pagado. Avisaremos cuando un chofer acepte
                      el viaje.
                    </span>
                  </div>
                )}

                <div className="p-5 bg-slate-50/80 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Dirección de entrega
                    </p>
                    <p className="font-semibold text-slate-900 text-sm leading-tight">
                      {envio.destino_direccion}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function GeocoderDownIcon() {
  return <ChevronDown className="w-4 h-4" />;
}
function GeocoderUpIcon() {
  return <ChevronUp className="w-4 h-4" />;
}
