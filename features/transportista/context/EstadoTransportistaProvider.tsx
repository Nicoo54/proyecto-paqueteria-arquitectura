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
  forzarUbicacionSimulada: (coords: Coordenada) => void;
}

const EstadoTransportistaContext =
  createContext<EstadoTransportistaContextType | null>(null);

const MODO_DEMO_ACTIVO = process.env.NEXT_PUBLIC_ENABLE_SIMULATOR === "true";
const PLAZA_RIVADAVIA: Coordenada = { lat: -38.7183, lng: -62.2663 };

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

  const forzarUbicacionSimulada = useCallback(
    (coords: Coordenada) => {
      setUbicacion(coords);

      disponibilidadService.actualizarUbicacion(
        { latitud: coords.lat, longitud: coords.lng },
        apiFetch,
      );
    },
    [apiFetch],
  );

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

    if (MODO_DEMO_ACTIVO) return;

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

    if (MODO_DEMO_ACTIVO) {
      setUbicacion(PLAZA_RIVADAVIA);
      setGpsHabilitado(true);
      setIsOnline(true);
      disponibilidadService.actualizarDisponibilidad(true, apiFetch);
      disponibilidadService.actualizarUbicacion(
        { latitud: PLAZA_RIVADAVIA.lat, longitud: PLAZA_RIVADAVIA.lng },
        apiFetch,
      );
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
        forzarUbicacionSimulada,
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
