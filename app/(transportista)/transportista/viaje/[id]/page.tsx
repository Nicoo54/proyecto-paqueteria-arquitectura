"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapRef } from "react-map-gl/mapbox";
import { useNavegacionEnvio } from "@/lib/transportista/viaje/hooks/useNavegacionEnvio";
import { useUbicacionEnVivo } from "@/lib/transportista/viaje/hooks/useUbicacionEnVivo";
import { useRutaMapbox } from "@/lib/transportista/viaje/hooks/useRutaMapbox";
import { MapaNavegacion } from "@/components/Transportista/viaje/MapaNavegacion";
import { TarjetaNavegacion } from "@/components/Transportista/viaje/TarjetaNavegacion";
import { distanciaKm } from "@/lib/utils";
import { DISTANCIA_MAXIMA_CONFIRMACION_KM } from "@/lib/transportista/viaje/constants";
import { ModalEntregaCompletada } from "@/components/Transportista/viaje/ModalEntregaCompletada";
import { useUbicacionSimulada } from "@/lib/transportista/viaje/hooks/useUbicacionSimulada";
import { useEstadoTransportista } from "@/lib/transportista/EstadoTransportistaProvider";

export default function NavegacionViajePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
  const mapRef = useRef<MapRef>(null);

  const { envio, fase, destinoActual, isUpdating, confirmarPaso } =
    useNavegacionEnvio(id);

  const useUbicacion =
    process.env.NEXT_PUBLIC_SIMULAR_GPS === "true"
      ? useUbicacionSimulada
      : useUbicacionEnVivo;

  const { ubicacion, error: errorGps } = useUbicacion(destinoActual);

  const distanciaAlDestino = ubicacion
    ? distanciaKm(ubicacion, destinoActual)
    : null;

  const puedeConfirmar =
    ubicacion !== null &&
    distanciaAlDestino !== null &&
    distanciaAlDestino <= DISTANCIA_MAXIMA_CONFIRMACION_KM;

  const { geometria, distanciaTexto, duracionTexto } = useRutaMapbox(
    ubicacion,
    destinoActual,
    mapboxToken,
  );

  const { marcarEnViaje } = useEstadoTransportista();

  useEffect(() => {
    marcarEnViaje(true);
    return () => marcarEnViaje(false);
  }, []);

  const [mostrarModalEntrega, setMostrarModalEntrega] = useState(false);

  const handleConfirmar = async () => {
    await confirmarPaso();

    // Si era el paso de entrega, el ciclo terminó -> volver al radar
    if (fase === "HACIA_ENTREGA") {
      setMostrarModalEntrega(true);
    }
  };

  const handleContinuarDesdeModal = () => {
    router.push("/transportista");
  };

  if (!envio || !fase || !destinoActual) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
