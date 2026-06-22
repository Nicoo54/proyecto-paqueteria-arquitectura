import { useState, useEffect } from "react";
import { Coordenada } from "../types";

const MODO_DEMO_ACTIVO = process.env.NEXT_PUBLIC_ENABLE_SIMULATOR === "true";

export function useSimuladorPaseo(
  geometria: GeoJSON.LineString | null,
  forzarUbicacion: (c: Coordenada) => void,
) {
  const [isSimulando, setIsSimulando] = useState(MODO_DEMO_ACTIVO);

  useEffect(() => {
    if (MODO_DEMO_ACTIVO && geometria) {
      setIsSimulando(true);
    }
  }, [geometria]);
  useEffect(() => {
    if (!isSimulando || !geometria) return;

    let indice = 0;
    const coordenadasCalle = geometria.coordinates;

    const intervalo = setInterval(() => {
      if (indice >= coordenadasCalle.length) {
        setIsSimulando(false);
        clearInterval(intervalo);
        return;
      }

      const [lng, lat] = coordenadasCalle[indice];

      forzarUbicacion({ lat, lng });

      indice += 1;
    }, 1000);

    return () => clearInterval(intervalo);
  }, [isSimulando, geometria, forzarUbicacion]);

  return { isSimulando, setIsSimulando };
}
