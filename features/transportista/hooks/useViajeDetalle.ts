import { viajesService } from "@/features/transportista/services/viajesService";
import { ViajeDetalle } from "@/features/transportista/viaje/types";
import { useEffect, useState } from "react";

export function useViajeDetalle(id: string) {
  const [viaje, setViaje] = useState<ViajeDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    setIsLoading(true);
    setError(null);
    setViaje(null);

    viajesService
      .obtenerDetalleViaje(id)
      .then((data) => {
        if (isMounted) setViaje(data);
      })
      .catch(() => {
        if (isMounted) setError("Error al recuperar los detalles de la orden.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { viaje, isLoading, error };
}
