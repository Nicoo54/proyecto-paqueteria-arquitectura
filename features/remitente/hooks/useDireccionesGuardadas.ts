"use client";

import { useEffect, useState } from "react";
import {
  DireccionGuardada,
  direccionesService,
} from "../services/direccionesService";

export function useDireccionesGuardadas() {
  const [direcciones, setDirecciones] = useState<DireccionGuardada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    direccionesService
      .obtenerDirecciones()
      .then((data) => {
        if (isMounted) setDirecciones(data);
      })
      .catch(() => {
        if (isMounted) setError("No se pudieron cargar tus direcciones.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { direcciones, isLoading, error };
}
