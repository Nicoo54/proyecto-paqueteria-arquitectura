import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { EnvioActivo } from "../types/cliente";
import { clienteService } from "../services/clienteService";

export function useEnvioActivo() {
  const { userId, isLoaded } = useAuth();
  const [envioActivo, setEnvioActivo] = useState<EnvioActivo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Si Clerk todavía está cargando la sesión, no hacemos nada
    if (!isLoaded) return;

    // Si no hay usuario logueado, cortamos la carga
    if (!userId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    clienteService
      .obtenerEnvioActivo(userId)
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
