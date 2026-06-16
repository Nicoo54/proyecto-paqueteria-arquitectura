import { useEffect, useState } from "react";
import { EnvioDB } from "../../../features/remitente/types";

interface Coordenada {
  lat: number;
  lng: number;
}

export function useTrackingEnvio(id: string) {
  const [envio, setEnvio] = useState<EnvioDB | null>(null);
  const [ubicacionMoto, setUbicacionMoto] = useState<Coordenada | null>(null);
  const [wsStatus, setWsStatus] = useState<
    "Conectando..." | "En vivo" | "Estatico"
  >("Conectando...");

  useEffect(() => {
    fetch(`/api/envios/${id}/tracking`)
      .then((r) => r.json())
      .then((data) => {
        setEnvio(data);
        setUbicacionMoto({ lat: data.origen_lat, lng: data.origen_lng });
      });
  }, [id]);

  useEffect(() => {
    if (!envio || envio.estado !== "EN_CAMINO") {
      setWsStatus("Estatico");
      return;
    }

    const ws = new WebSocket("ws://api.packeteer.com/v1/streaming");

    ws.onopen = () => setWsStatus("En vivo");

    ws.onmessage = (event) => {
      const { lat, lng } = JSON.parse(event.data);
      setUbicacionMoto({ lat, lng });
    };

    ws.onerror = () => setWsStatus("Estatico");

    return () => ws.close(); // cleanup importante
  }, [envio]);

  return { envio, ubicacionMoto, wsStatus };
}
