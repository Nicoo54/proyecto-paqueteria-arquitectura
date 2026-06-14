"use client";

import { createContext, useContext, useState } from "react";

const EstadoTransportistaContext = createContext<{
  isOnline: boolean;
  setIsOnline: (v: boolean) => void;
} | null>(null);

export function EstadoTransportistaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOnline, setIsOnline] = useState(false);
  // TODO: sincronizar con el backend para actualizar estado
  return (
    <EstadoTransportistaContext.Provider value={{ isOnline, setIsOnline }}>
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
