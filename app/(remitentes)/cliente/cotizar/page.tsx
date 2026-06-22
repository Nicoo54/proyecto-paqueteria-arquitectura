"use client";

import { useState } from "react";
import { Ubicacion } from "@/shared/types/ubicacion";
import { useMapboxRoute } from "@/features/remitente/hooks/useMapboxRoute";
import FormularioCotizador from "@/components/cliente/FormularioCotizador";
import MapaRuta from "@/components/cliente/MapaRuta";

export default function CotizarPage() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  const [origen, setOrigen] = useState<Ubicacion | null>(null);
  const [destino, setDestino] = useState<Ubicacion | null>(null);

  const geometriaRuta = useMapboxRoute(origen, destino, mapboxToken);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100dvh-64px)] w-full bg-slate-50 overflow-hidden">
      <FormularioCotizador
        origen={origen}
        setOrigen={setOrigen}
        destino={destino}
        setDestino={setDestino}
        mapboxToken={mapboxToken}
      />

      <MapaRuta
        origen={origen}
        destino={destino}
        geometriaRuta={geometriaRuta}
        mapboxToken={mapboxToken}
      />
    </div>
  );
}
