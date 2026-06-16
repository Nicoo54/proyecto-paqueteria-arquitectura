import { useState, useEffect } from "react";
import { EnvioTracking, UbicacionCoordenadas } from "../types/tracking";
import { trackingService } from "../services/trackingService";

export function useTracking(id: string) {
  const [envio, setEnvio] = useState<EnvioTracking | null>(null);
  const [ubicacionMoto, setUbicacionMoto] =
    useState<UbicacionCoordenadas | null>(null);
  const [wsStatus, setWsStatus] = useState<
    "Conectando..." | "En vivo" | "Estatico"
  >("Conectando...");
  const [isLoading, setIsLoading] = useState(true);

  // 1. Carga inicial de datos
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

  // 2. Simulación de conexión a WebSocket
  useEffect(() => {
    if (!envio) return;

    if (envio.estado !== "EN_CAMINO") {
      setWsStatus("Estatico");
      return;
    }

    setWsStatus("En vivo");

    // Intervalo que simula las coordenadas recibidas cada 3 segundos
    const wsMockInterval = setInterval(() => {
      setUbicacionMoto((prev) => {
        if (!prev) return prev;

        // Mueve la moto un 5% más cerca del destino en cada tick
        const step = 0.05;
        const newLat = prev.lat + (envio.destino_lat - prev.lat) * step;
        const newLng = prev.lng + (envio.destino_lng - prev.lng) * step;

        return { lat: newLat, lng: newLng };
      });
    }, 3000);

    return () => clearInterval(wsMockInterval);
  }, [envio]);

  return { envio, ubicacionMoto, wsStatus, isLoading };
}
