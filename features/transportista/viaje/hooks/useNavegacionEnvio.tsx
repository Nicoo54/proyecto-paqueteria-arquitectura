"use client";

import { useEffect, useState } from "react";
import { EnvioDB, Fase } from "../types";
import { viajeService } from "../services/viajeService";
import { useApiClient } from "@/shared/api-client";

export function useNavegacionEnvio(id: string) {
  const { apiFetch } = useApiClient();
  const [envio, setEnvio] = useState<EnvioDB | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    viajeService
      .obtenerEnvio(id, apiFetch)
      .then((data) => {
        if (!data) {
          setError("no_encontrado");
        } else {
          setEnvio(data);
        }
      })
      .catch(() => setError("no_encontrado"));
  }, [id, apiFetch]);

  const fase: Fase | null = !envio
    ? null
    : envio.estado === "ACEPTADO"
      ? "HACIA_RETIRO"
      : envio.estado === "RETIRADO"
        ? "LISTO_PARA_ARRANCAR"
        : "HACIA_ENTREGA";

  const destinoActual = !envio
    ? null
    : envio.estado === "ACEPTADO"
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
    if (!envio) return null;
    setIsUpdating(true);

    let nuevoEstado = "";
    if (envio.estado === "ACEPTADO") {
      nuevoEstado = "RETIRADO";
    } else if (envio.estado === "RETIRADO") {
      nuevoEstado = "EN_CAMINO";
    } else if (envio.estado === "EN_CAMINO") {
      nuevoEstado = "ENTREGADO";
    } else {
      setIsUpdating(false);
      return null; // Si ya se entregó o canceló, no hacemos nada
    }

    try {
      await viajeService.actualizarEstadoEnvio(
        envio.codigo_envio,
        nuevoEstado as any,
        apiFetch,
      );
      setEnvio({ ...envio, estado: nuevoEstado as any });

      return nuevoEstado;
    } catch (error) {
      console.error("Error al confirmar el paso:", error);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return { envio, fase, destinoActual, isUpdating, confirmarPaso, error };
}
