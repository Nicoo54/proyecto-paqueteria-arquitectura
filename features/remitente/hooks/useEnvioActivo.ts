import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { EnvioActivo } from "../types/cliente";
import { useApiClient } from "@/shared/api-client";
import { enviosService } from "../services/enviosService";

export function useEnvioActivo() {
  const { apiFetch } = useApiClient();
  const { userId, isLoaded } = useAuth();
  const [envioActivo, setEnvioActivo] = useState<EnvioActivo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    enviosService
      .obtenerEnvioActivo(apiFetch)
      .then((data) => {
        if (!isMounted) return;
        setEnvioActivo(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error obteniendo el envío activo:", error);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId, isLoaded]);

  return { envioActivo, isLoading };
}
