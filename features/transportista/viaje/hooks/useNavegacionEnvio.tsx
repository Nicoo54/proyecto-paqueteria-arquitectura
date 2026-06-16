"use client";

import { useEffect, useState } from "react";
import { EnvioDB, Fase } from "../types";
import { viajeService } from "../services/viajeService";

export function useNavegacionEnvio(id: string) {
  const [envio, setEnvio] = useState<EnvioDB | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    viajeService.fetchEnvio(id).then(setEnvio);
  }, [id]);

  const fase: Fase | null = !envio
    ? null
    : envio.estado === "ASIGNADO"
      ? "HACIA_RETIRO"
      : "HACIA_ENTREGA";

  const destinoActual = !envio
    ? null
    : fase === "HACIA_RETIRO"
      ? {
          lat: envio.origen_lat,
          lng: envio.origen_lng,
          direccion: envio.origen_direccion,
        }
      : {
          lat: envio.destino_lat,
          lng: envio.destino_lng,
          direccion: envio.destino_direccion,
        };

  const confirmarPaso = async () => {
    if (!envio || !fase) return;
    setIsUpdating(true);

    const nuevoEstado = fase === "HACIA_RETIRO" ? "EN_CAMINO" : "ENTREGADO";

    try {
      await viajeService.actualizarEstadoEnvio(envio.codigo_envio, nuevoEstado);
      setEnvio({ ...envio, estado: nuevoEstado });
    } finally {
      setIsUpdating(false);
    }
  };

  return { envio, fase, destinoActual, isUpdating, confirmarPaso };
}
