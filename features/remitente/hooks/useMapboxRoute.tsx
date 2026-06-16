import { useState, useEffect } from "react";
import { Ubicacion } from "@/shared/types/ubicacion";
import { cotizacionService } from "../services/cotizacionService";

export function useMapboxRoute(
  origen: Ubicacion | null,
  destino: Ubicacion | null,
  mapboxToken: string,
) {
  const [geometriaRuta, setGeometriaRuta] = useState<any>(null);

  useEffect(() => {
    if (origen && destino && mapboxToken) {
      cotizacionService
        .obtenerGeometriaRuta(origen, destino, mapboxToken)
        .then(setGeometriaRuta)
        .catch(console.error);
    } else {
      setGeometriaRuta(null);
    }
  }, [origen, destino, mapboxToken]);

  return geometriaRuta;
}
