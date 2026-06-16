"use client";

import { useEffect, useRef, useState } from "react";
import { Coordenada } from "../types";

const ORIGEN_SIMULADO: Coordenada = { lat: -38.7283, lng: -62.2763 };

export function useUbicacionSimulada(destino: Coordenada | null) {
  const [ubicacion, setUbicacion] = useState<Coordenada>(ORIGEN_SIMULADO);
  const destinoRef = useRef(destino);
  destinoRef.current = destino;

  useEffect(() => {
    const interval = setInterval(() => {
      setUbicacion((prev) => {
        const dest = destinoRef.current;
        if (!dest) return prev;

        const step = 0.05; // % de la distancia restante por tick
        const newLat = prev.lat + (dest.lat - prev.lat) * step;
        const newLng = prev.lng + (dest.lng - prev.lng) * step;

        return { lat: newLat, lng: newLng };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { ubicacion, error: null };
}
