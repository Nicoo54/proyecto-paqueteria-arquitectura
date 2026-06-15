import { viajesService } from "@/lib/service/transportista/viajesService";
import { ViajeHistorial } from "@/lib/transportista/viaje/types";
import { useState, useEffect } from "react";

export function useViajesHistorial() {
  const [viajes, setViajes] = useState<ViajeHistorial[]>([]);
  const [totalGanado, setTotalGanado] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    viajesService
      .obtenerHistorialViajes()
      .then((data) => {
        if (!isMounted) return;
        setViajes(data.viajes);
        setTotalGanado(data.totalGanado);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError("No se pudo cargar el historial de viajes.");
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { viajes, totalGanado, isLoading, error };
}
