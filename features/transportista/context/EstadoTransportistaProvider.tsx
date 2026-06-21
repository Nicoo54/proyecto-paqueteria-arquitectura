"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Coordenada } from "../viaje/types";
import { useApiClient } from "@/shared/api-client";
import { disponibilidadService } from "../services/trackeoService";

interface EstadoTransportistaContextType {
  isOnline: boolean;
  enViaje: boolean;
  gpsHabilitado: boolean;
  ubicacion: Coordenada | null;
  toggleOnline: () => void;
  marcarEnViaje: (activo: boolean) => void;
}

const EstadoTransportistaContext =
  createContext<EstadoTransportistaContextType | null>(null);

export function EstadoTransportistaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { apiFetch } = useApiClient();
  const [isOnline, setIsOnline] = useState(false);
  const [enViaje, setEnViaje] = useState(false);
  const [gpsHabilitado, setGpsHabilitado] = useState(false);
  const [ubicacion, setUbicacion] = useState<Coordenada | null>(null);

  // Monitorea si el permiso de ubicación está otorgado, y reacciona si lo revocan
  useEffect(() => {
    if (!navigator.permissions) return;

    let permissionStatus: PermissionStatus | null = null;

    navigator.permissions.query({ name: "geolocation" }).then((status) => {
      permissionStatus = status;
      setGpsHabilitado(status.state === "granted");

      status.onchange = () => {
        const habilitado = status.state === "granted";
        setGpsHabilitado(habilitado);
        if (!habilitado) {
          setIsOnline(false);
          disponibilidadService.actualizarDisponibilidad(false, apiFetch);
        }
      };
    });

    return () => {
      if (permissionStatus) permissionStatus.onchange = null;
    };
  }, []);

  // Mientras está online, reporta posición periódicamente
  useEffect(() => {
    if (!isOnline) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUbicacion({
          lat: lat,
          lng: lng,
        });
        disponibilidadService.actualizarUbicacion(
          { latitud: lat, longitud: lng },
          apiFetch,
        );
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        setIsOnline(false);
      },
      { enableHighAccuracy: true, maximumAge: 10000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isOnline]);

  const toggleOnline = () => {
    if (enViaje) return;

    if (isOnline) {
      setIsOnline(false);
      disponibilidadService.actualizarDisponibilidad(false, apiFetch);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUbicacion({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGpsHabilitado(true);
        setIsOnline(true);
        disponibilidadService.actualizarDisponibilidad(true, apiFetch);
        disponibilidadService.actualizarUbicacion(
          { latitud: pos.coords.latitude, longitud: pos.coords.longitude },
          apiFetch,
        );
      },
      () => {
        alert(
          "Necesitás habilitar la ubicación para activar tu disponibilidad",
        );
        setGpsHabilitado(false);
        setIsOnline(false);
      },
      { enableHighAccuracy: true },
    );
  };

  const marcarEnViaje = useCallback((activo: boolean) => {
    setEnViaje(activo);
    if (activo) setIsOnline(true);
  }, []);

  return (
    <EstadoTransportistaContext.Provider
      value={{
        isOnline,
        enViaje,
        gpsHabilitado,
        ubicacion,
        toggleOnline,
        marcarEnViaje,
      }}
    >
      {children}
    </EstadoTransportistaContext.Provider>
  );
}

export function useEstadoTransportista() {
  const ctx = useContext(EstadoTransportistaContext);
  if (!ctx)
    throw new Error("useEstadoTransportista debe usarse dentro del Provider");
  return ctx;
}
