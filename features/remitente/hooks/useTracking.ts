import { useState, useEffect, useRef } from "react";
import { EnvioTracking, UbicacionCoordenadas } from "../types/tracking";
import { trackingService } from "../services/trackingService";

const POLLING_INTERVAL_MS = 10000;

export function useTracking(id: string) {
  const [envio, setEnvio] = useState<EnvioTracking | null>(null);
  const [ubicacionMoto, setUbicacionMoto] =
    useState<UbicacionCoordenadas | null>(null);
  const [wsStatus, setWsStatus] = useState<
    "Conectando..." | "En vivo" | "Estatico"
  >("Conectando...");
  const [isLoading, setIsLoading] = useState(true);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const detenerPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  // 1. Carga inicial
  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    trackingService.obtenerEnvioTracking(id).then((data) => {
      if (!isMounted) return;
      setEnvio(data);
      setUbicacionMoto({ lat: data.origen_lat, lng: data.origen_lng });
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // 2. Polling — arranca cuando hay envio y está EN_CAMINO, se detiene si no
  useEffect(() => {
    if (!envio) return;

    if (envio.estado !== "EN_CAMINO") {
      setWsStatus("Estatico");
      detenerPolling();
      return;
    }

    setWsStatus("En vivo");

    pollingRef.current = setInterval(async () => {
      try {
        const data = await trackingService.obtenerEnvioTracking(id);
        setEnvio(data);
        setUbicacionMoto({ lat: data.origen_lat, lng: data.origen_lng });

        // Si el envío pasó a ENTREGADO, se detiene el polling
        if (data.estado !== "EN_CAMINO") {
          setWsStatus("Estatico");
          detenerPolling();
        }
      } catch (error) {
        console.error("Error en polling de tracking:", error);
      }
    }, POLLING_INTERVAL_MS);

    return () => detenerPolling();
  }, [envio?.estado, id]);

  return { envio, ubicacionMoto, wsStatus, isLoading };
}
