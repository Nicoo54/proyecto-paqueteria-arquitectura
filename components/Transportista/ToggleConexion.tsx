"use client";

import { useEstadoTransportista } from "@/lib/transportista/EstadoTransportistaProvider";

export function ToggleConexion() {
  const { isOnline, enViaje, toggleOnline } = useEstadoTransportista();

  const label = enViaje ? "En viaje" : isOnline ? "Activo" : "Inactivo";
  const colorTexto = enViaje
    ? "text-amber-400"
    : isOnline
      ? "text-emerald-400"
      : "text-slate-400";
  const colorFondo = enViaje
    ? "bg-amber-500"
    : isOnline
      ? "bg-emerald-500"
      : "bg-slate-600";

  return (
    <div className="flex items-center gap-2 bg-slate-800 rounded-full p-1 pr-3 border border-slate-700">
      <button
        onClick={toggleOnline}
        disabled={enViaje}
        aria-label={
          isOnline ? "Desactivar disponibilidad" : "Activar disponibilidad"
        }
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${colorFondo} ${enViaje ? "cursor-not-allowed opacity-80" : ""}`}
      >
        <div
          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${isOnline || enViaje ? "translate-x-6" : "translate-x-0"}`}
        />
      </button>
      <span
        className={`text-xs font-bold uppercase tracking-wider ${colorTexto}`}
      >
        {label}
      </span>
    </div>
  );
}
