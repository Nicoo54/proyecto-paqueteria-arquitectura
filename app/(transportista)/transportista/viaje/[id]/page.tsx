"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapRef } from "react-map-gl/mapbox";
import { useNavegacionEnvio } from "@/features/transportista/viaje/hooks/useNavegacionEnvio";
import { useRutaMapbox } from "@/features/transportista/viaje/hooks/useRutaMapbox";
import { MapaNavegacion } from "@/components/Transportista/viaje/MapaNavegacion";
import { TarjetaNavegacion } from "@/components/Transportista/viaje/TarjetaNavegacion";
import { distanciaKm } from "@/lib/utils";
import { DISTANCIA_MAXIMA_CONFIRMACION_KM } from "@/features/transportista/viaje/constants";
import { ModalEntregaCompletada } from "@/components/Transportista/viaje/ModalEntregaCompletada";
import { useEstadoTransportista } from "@/features/transportista/context/EstadoTransportistaProvider";
import ErrorTracking from "@/components/Transportista/viaje/ErrorTracking";
import { useSimuladorPaseo } from "@/features/transportista/viaje/hooks/useSimulador";

export default function NavegacionViajePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
  const mapRef = useRef<MapRef>(null);

  const { envio, fase, destinoActual, isUpdating, confirmarPaso, error } =
    useNavegacionEnvio(id);

  const { ubicacion, marcarEnViaje, forzarUbicacionSimulada } =
    useEstadoTransportista();
  const errorGps = null;

  const { geometria, distanciaTexto, duracionTexto } = useRutaMapbox(
    ubicacion,
    destinoActual,
    mapboxToken,
  );

  useSimuladorPaseo(geometria, forzarUbicacionSimulada);

  const [mostrarModalEntrega, setMostrarModalEntrega] = useState(false);

  useEffect(() => {
    marcarEnViaje(true);
    return () => marcarEnViaje(false);
  }, [marcarEnViaje]);

  useEffect(() => {
    if (mapRef.current && ubicacion) {
      mapRef.current.flyTo({
        center: [ubicacion.lng, ubicacion.lat],
        duration: 800,
        zoom: 14.5,
        pitch: 45,
      });
    }
  }, [ubicacion]);

  if (!envio || !fase || !destinoActual) {
    return error ? (
      <ErrorTracking />
    ) : (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const distanciaAlDestino = ubicacion
    ? distanciaKm(ubicacion, destinoActual)
    : null;

  const puedeConfirmar =
    ubicacion !== null &&
    distanciaAlDestino !== null &&
    distanciaAlDestino <= DISTANCIA_MAXIMA_CONFIRMACION_KM;

  const handleConfirmar = async () => {
    const nuevoEstado = await confirmarPaso();

    // Si era el paso de entrega, el ciclo terminó -> volver al radar
    if (nuevoEstado === "ENTREGADO") {
      setMostrarModalEntrega(true);
    }
  };

  const handleContinuarDesdeModal = () => {
    router.push("/transportista");
  };

  return (
    <div className="relative flex-1 min-h-0 w-full overflow-hidden bg-slate-200">
      <MapaNavegacion
        ref={mapRef}
        mapboxToken={mapboxToken}
        ubicacionPropia={ubicacion}
        destino={destinoActual}
        geometriaRuta={geometria}
      />

      {errorGps && (
        <div className="absolute top-4 inset-x-4 z-10 bg-red-500 text-white text-sm font-bold p-3 rounded-xl text-center">
          {errorGps}
        </div>
      )}

      <TarjetaNavegacion
        fase={fase}
        direccion={destinoActual.direccion}
        distanciaTexto={distanciaTexto}
        duracionTexto={duracionTexto}
        isUpdating={isUpdating}
        puedeConfirmar={puedeConfirmar}
        tieneGps={ubicacion !== null}
        onConfirmar={handleConfirmar}
      />

      <ModalEntregaCompletada
        open={mostrarModalEntrega}
        codigoEnvio={envio.codigo_envio}
        onContinuar={handleContinuarDesdeModal}
      />
    </div>
  );
}
