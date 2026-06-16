"use client";

import FormularioCotizador from "@/components/cliente/FormularioCotizador";
import MapaRuta from "@/components/cliente/MapaRuta";
import { useMapboxRoute } from "@/lib/cliente/hooks/useMapboxRoute";
import { Ubicacion } from "@/features/remitente/types";
import { useState } from "react";

export default function CotizarPage() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  const [origen, setOrigen] = useState<Ubicacion>(null);
  const [destino, setDestino] = useState<Ubicacion>(null);

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
