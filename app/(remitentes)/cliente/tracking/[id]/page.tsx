"use client";

import { use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTracking } from "@/features/remitente/hooks/useTracking";
import HeaderTracking from "@/components/cliente/tracking/HeaderTracking";
import TarjetaTracking from "@/components/cliente/tracking/TarjetaTracking";
import PanelCalificacion from "@/components/cliente/PanelCalificacion";

export default function TrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
  const mapRef = useRef<any>(null);

  const { envio, ubicacionMoto, wsStatus, isLoading } = useTracking(id);

  useEffect(() => {
    const ESTADOS_TRACKEABLES = ["ACEPTADO", "RETIRADO", "EN_CAMINO"];

    if (
      mapRef.current &&
      ubicacionMoto &&
      ESTADOS_TRACKEABLES.includes(envio?.estado || "")
    ) {
      mapRef.current.flyTo({
        center: [ubicacionMoto.lng, ubicacionMoto.lat],
        duration: 2000,
        zoom: 15,
      });
    }
  }, [ubicacionMoto, envio?.estado]);

  if (isLoading || !envio || !ubicacionMoto) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (envio.estado === "ENTREGADO") {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center bg-slate-50 p-6 text-center animate-in fade-in zoom-in-95 duration-500 w-full">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          ¡Paquete Entregado!
        </h1>
        <p className="text-slate-500 font-medium mb-8 max-w-md">
          Tu envío a{" "}
          <strong className="text-slate-700">{envio.destino_direccion}</strong>{" "}
          se completó con éxito.
        </p>

        {envio.chofer && (
          <div className="w-full max-w-sm mb-8 text-left">
            <PanelCalificacion
              codigoEnvio={envio.codigo_envio}
              nombreTransportista={envio.chofer.nombre}
              resenaPrevia={envio.resena}
            />
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => router.push("/cliente")}
          className="h-12 px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio
        </Button>
      </div>
    );
  }

  const ESTADOS_TRACKEABLES = ["ACEPTADO", "RETIRADO", "EN_CAMINO"];
  const esTrackeable = ESTADOS_TRACKEABLES.includes(envio.estado);

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-200">
      {mapboxToken ? (
        <div className="absolute inset-0 z-0">
          <Map
            ref={mapRef}
            mapboxAccessToken={mapboxToken}
            initialViewState={{
              longitude: esTrackeable ? ubicacionMoto.lng : envio.origen_lng,
              latitude: esTrackeable ? ubicacionMoto.lat : envio.origen_lat,
              zoom: 14.5,
              pitch: esTrackeable ? 45 : 0,
            }}
            mapStyle="mapbox://styles/mapbox/navigation-day-v1"
            style={{ width: "100%", height: "100%" }}
          >
            <Marker
              longitude={envio.origen_lng}
              latitude={envio.origen_lat}
              anchor="bottom"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-slate-900 flex items-center justify-center rounded-full shadow-lg border-2 border-white relative z-10">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
              </div>
            </Marker>

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

            {esTrackeable && (
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

      <HeaderTracking wsStatus={wsStatus} estadoEnvio={envio.estado} />
      <TarjetaTracking envio={envio} />
    </div>
  );
}
