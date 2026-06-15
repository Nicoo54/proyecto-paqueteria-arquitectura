import { metricasService } from "@/lib/service/soporte/metricasService";
import { ConsolidadorMetricas, ZonaCalienteDB } from "@/lib/types/metricas";
import { useState, useEffect } from "react";

export function useDashboardMetricas() {
  const [metricas, setMetricas] = useState<ConsolidadorMetricas | null>(null);
  const [zonas, setZonas] = useState<ZonaCalienteDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [geoJsonZonas, setGeoJsonZonas] = useState<any>(null);

  const crearCirculoGeoJson = (
    centroLat: number,
    centroLng: number,
    radioMetros: number,
  ) => {
    const puntos = 64;
    const coordenadas: number[][] = [];
    const distanciaKilometros = radioMetros / 1000;
    const radioTierraKilometros = 6371;

    const latRad = (centroLat * Math.PI) / 180;
    const lngRad = (centroLng * Math.PI) / 180;
    const distRad = distanciaKilometros / radioTierraKilometros;

    for (let i = 0; i <= puntos; i++) {
      const angulo = (i * 2 * Math.PI) / puntos;
      const puntoLatRad = Math.asin(
        Math.sin(latRad) * Math.cos(distRad) +
          Math.cos(latRad) * Math.sin(distRad) * Math.cos(angulo),
      );
      const puntoLngRad =
        lngRad +
        Math.atan2(
          Math.sin(angulo) * Math.sin(distRad) * Math.cos(latRad),
          Math.cos(distRad) - Math.sin(latRad) * Math.sin(puntoLatRad),
        );

      coordenadas.push([
        (puntoLngRad * 180) / Math.PI,
        (puntoLatRad * 180) / Math.PI,
      ]);
    }

    return {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [coordenadas] },
      properties: {},
    };
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      metricasService.obtenerMétricasBatch(),
      metricasService.obtenerZonasCalientes(),
    ]).then(([resMetricas, resZonas]) => {
      if (!isMounted) return;

      setMetricas(resMetricas);
      setZonas(resZonas);

      if (resZonas.length > 0) {
        const features = resZonas.map((z) =>
          crearCirculoGeoJson(z.centro_lat, z.centro_lng, z.radio_m),
        );
        setGeoJsonZonas({ type: "FeatureCollection", features });
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { metricas, zonas, geoJsonZonas, isLoading };
}
