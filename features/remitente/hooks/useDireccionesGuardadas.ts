"use client";

import { useEffect, useState } from "react";
import { direccionesService } from "../services/direccionesService";
import { DireccionGuardada } from "../types/direccione";
import { useApiClient } from "@/shared/api-client";

export function useDireccionesGuardadas() {
  const { apiFetch } = useApiClient();
  const [direcciones, setDirecciones] = useState<DireccionGuardada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    direccionesService
      .obtenerDirecciones(apiFetch)
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
