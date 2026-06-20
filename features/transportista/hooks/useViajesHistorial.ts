import { viajesService } from "@/features/transportista/services/viajesService";
import { ViajeHistorial } from "@/features/transportista/viaje/types";
import { useApiClient } from "@/shared/api-client";
import { useState, useEffect } from "react";

export function useViajesHistorial() {
  const { apiFetch } = useApiClient();

  const [viajes, setViajes] = useState<ViajeHistorial[]>([]);
  const [totalGanado, setTotalGanado] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    viajesService
      .obtenerHistorialViajes(apiFetch)
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
