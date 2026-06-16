import { useState, useEffect } from "react";
import { EnvioDetalle } from "../types/detalleEnvio";
import { detalleEnvioService } from "../services/detalleEnvioService";

export function useDetalleEnvio(id: string) {
  const [envio, setEnvio] = useState<EnvioDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setIsLoading(true);

    detalleEnvioService
      .obtenerDetalle(id)
      .then((data) => {
        if (!isMounted) return;
        setEnvio(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar detalle del envío:", err);
        if (!isMounted) return;
        setError("No se pudo cargar la información del envío.");
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { envio, isLoading, error };
}
