"use client";

import { useEffect, useState } from "react";
import { useEstadoTransportista } from "../context/EstadoTransportistaProvider";
import { PaqueteDisponible } from "../types/types";
import { fetchPaquetesDisponibles, fetchViajeActivo } from "../mocks";

export function useRadarTransportista() {
  const { isOnline } = useEstadoTransportista();

  const [isLoading, setIsLoading] = useState(false);
  const [viajeActivo, setViajeActivo] = useState<{ id: string } | null>(null);
  const [paquetes, setPaquetes] = useState<PaqueteDisponible[]>([]);

  useEffect(() => {
    if (!isOnline) {
      setPaquetes([]);
      setViajeActivo(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const inicializarRadar = async () => {
      const viaje = await fetchViajeActivo();
      if (!isMounted) return;

      if (viaje) {
        setViajeActivo(viaje);
        setIsLoading(false);
        return;
      }

      const disponibles = await fetchPaquetesDisponibles();
      if (isMounted) {
        setPaquetes(disponibles);
        setIsLoading(false);
      }
    };

    inicializarRadar();

    return () => {
      isMounted = false;
    };
  }, [isOnline]);

  return { isOnline, isLoading, viajeActivo, paquetes };
}
