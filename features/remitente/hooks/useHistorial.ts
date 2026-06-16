import { useState, useEffect } from "react";
import { historialService } from "../services/historialService";
import { EnvioHistorial } from "../types/historial";

export function useHistorial() {
  const [envios, setEnvios] = useState<EnvioHistorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    historialService
      .obtenerHistorial()
      .then((data) => {
        if (!isMounted) return;
        setEnvios(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando el historial:", error);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { envios, isLoading };
}
