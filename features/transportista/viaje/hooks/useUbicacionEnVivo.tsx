"use client";

import { useEffect, useState } from "react";
import { Coordenada } from "../types";

export function useUbicacionEnVivo() {
  const [ubicacion, setUbicacion] = useState<Coordenada | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError(null);
        // TODO: enviar ubicación al backend / WS para que el cliente la vea
      },
      () => setError("No se pudo obtener tu ubicación. Verificá el GPS."),
      { enableHighAccuracy: true, maximumAge: 5000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { ubicacion, error };
}
