"use client";

import { useEffect, useRef, useState } from "react";
import { Coordenada } from "../types";
import { distanciaKm } from "@/lib/utils";

const INTERVALO_MINIMO_MS = 15000; // recalcular cada 15s como máximo
const DISTANCIA_MINIMA_KM = 0.05; // o si se movió 50m

export function useRutaMapbox(
  origen: Coordenada | null,
  destino: Coordenada | null,
  mapboxToken: string,
) {
  const [geometria, setGeometria] = useState<GeoJSON.LineString | null>(null);
  const [distanciaTexto, setDistanciaTexto] = useState<string>("");
  const [duracionTexto, setDuracionTexto] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const ultimoDestino = useRef<Coordenada | null>(null);
  const ultimaConsulta = useRef<{ tiempo: number; pos: Coordenada } | null>(
    null,
  );

  useEffect(() => {
    if (!origen || !destino || !mapboxToken) return;

    const ahora = Date.now();
    const previa = ultimaConsulta.current;

    const destinoCambio =
      !ultimoDestino.current ||
      ultimoDestino.current.lat !== destino.lat ||
      ultimoDestino.current.lng !== destino.lng;

    const debeRecalcular =
      !previa ||
      destinoCambio ||
      ahora - previa.tiempo > INTERVALO_MINIMO_MS ||
      distanciaKm(previa.pos, origen) > DISTANCIA_MINIMA_KM;

    if (!debeRecalcular) return;

    ultimaConsulta.current = { tiempo: ahora, pos: origen };
    ultimoDestino.current = destino;
    setIsLoading(true);

    const url =
      `https://api.mapbox.com/directions/v5/mapbox/driving/` +
      `${origen.lng},${origen.lat};${destino.lng},${destino.lat}` +
      `?geometries=geojson&overview=full&access_token=${mapboxToken}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const ruta = data.routes?.[0];
        if (!ruta) return;
        setGeometria(ruta.geometry);
        setDistanciaTexto(`${(ruta.distance / 1000).toFixed(1)} km`);
        setDuracionTexto(`${Math.round(ruta.duration / 60)} min`);
      })
      .catch((err) => console.error("Error obteniendo ruta:", err))
      .finally(() => setIsLoading(false));
  }, [origen, destino, mapboxToken]);

  return { geometria, distanciaTexto, duracionTexto, isLoading };
}
