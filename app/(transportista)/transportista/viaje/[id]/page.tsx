"use client";

import { use, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapRef } from "react-map-gl/mapbox";
import { useNavegacionEnvio } from "@/lib/transportista/viaje/hooks/useNavegacionEnvio";
import { useUbicacionEnVivo } from "@/lib/transportista/viaje/hooks/useUbicacionEnVivo";
import { useRutaMapbox } from "@/lib/transportista/viaje/hooks/useRutaMapbox";
import { MapaNavegacion } from "@/components/Transportista/viaje/MapaNavegacion";
import { TarjetaNavegacion } from "@/components/Transportista/viaje/TarjetaNavegacion";

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

  const { ubicacion, error: errorGps } = useUbicacionEnVivo();
  const { geometria, distanciaTexto, duracionTexto } = useRutaMapbox(
    ubicacion,
    destinoActual,
    mapboxToken,
  );

  const handleConfirmar = async () => {
    await confirmarPaso();

    // Si era el paso de entrega, el ciclo terminó -> volver al radar
    if (fase === "HACIA_ENTREGA") {
      router.push("/transportista");
    }
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
        onConfirmar={handleConfirmar}
      />
    </div>
  );
}
