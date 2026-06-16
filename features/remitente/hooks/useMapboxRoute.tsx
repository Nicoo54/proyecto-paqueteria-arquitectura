import { useState, useEffect } from "react";
import { Ubicacion } from "../../../features/remitente/types";

// Hook personalizado para obtener la ruta entre origen y destino usando Mapbox Directions API
export function useMapboxRoute(
  origen: Ubicacion,
  destino: Ubicacion,
  mapboxToken: string,
) {
  const [geometriaRuta, setGeometriaRuta] = useState<any>(null);

  useEffect(() => {
    if (origen && destino && mapboxToken) {
      const obtenerRuta = async () => {
        try {
          const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origen.lng},${origen.lat};${destino.lng},${destino.lat}?geometries=geojson&access_token=${mapboxToken}`;
          const response = await fetch(url);
          const data = await response.json();

          if (data.routes && data.routes.length > 0) {
            setGeometriaRuta(data.routes[0].geometry);
          }
        } catch (error) {
          console.error("Error al calcular la ruta:", error);
        }
      };
      obtenerRuta();
    } else {
      setGeometriaRuta(null);
    }
  }, [origen, destino, mapboxToken]);

  return geometriaRuta;
}
