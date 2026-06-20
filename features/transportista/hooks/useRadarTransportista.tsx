"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEstadoTransportista } from "../context/EstadoTransportistaProvider";
import { PaqueteDisponible } from "../types/types";
import { radarService } from "../services/radarService";
import { useApiClient } from "@/shared/api-client";

export function useRadarTransportista() {
  const router = useRouter();
  const { isOnline, ubicacion } = useEstadoTransportista();
  const { apiFetch } = useApiClient();
  // Estados de carga inicial
  const [isLoading, setIsLoading] = useState(false);
  const [viajeActivo, setViajeActivo] = useState<{ id: string } | null>(null);
  const [paquetes, setPaquetes] = useState<PaqueteDisponible[]>([]);
  const [radioKm, setRadioKm] = useState(5);

  // Estados de interacción del usuario
  const [paqueteSeleccionado, setPaqueteSeleccionado] =
    useState<PaqueteDisponible | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    if (!isOnline || !ubicacion) {
      setPaquetes([]);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const buscarPaquetes = async () => {
      try {
        const disponibles = await radarService.obtenerPaquetesDisponibles(
          ubicacion.lat,
          ubicacion.lng,
          radioKm,
          apiFetch,
        );
        if (isMounted) setPaquetes(disponibles);
      } catch (error) {
        console.error("Error explorando envíos:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    buscarPaquetes();

    return () => {
      isMounted = false;
    };
  }, [isOnline, ubicacion?.lat, ubicacion?.lng, radioKm, apiFetch]);

  const handleAceptarViaje = async () => {
    if (!paqueteSeleccionado) return;

    setIsAccepting(true);
    try {
      await radarService.aceptarViaje(paqueteSeleccionado.id, apiFetch);
      router.push(`/transportista/viaje/${paqueteSeleccionado.id}`);
    } catch (error) {
      console.error("Error al aceptar el viaje", error);
    } finally {
      setIsAccepting(false);
    }
  };

  return {
    isOnline,
    isLoading,
    viajeActivo,
    paquetes,
    paqueteSeleccionado,
    setPaqueteSeleccionado,
    isAccepting,
    handleAceptarViaje,
    radioKm,
    setRadioKm,
  };
}
