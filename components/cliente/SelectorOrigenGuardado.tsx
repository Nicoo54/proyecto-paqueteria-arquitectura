"use client";

import {
  DireccionGuardada,
  direccionAUbicacion,
} from "@/features/remitente/services/direccionesService";
import { useDireccionesGuardadas } from "@/features/remitente/hooks/useDireccionesGuardadas";
import { Ubicacion } from "@/shared/types/ubicacion";
import { MapPin } from "lucide-react";

interface Props {
  onSeleccionar: (ubicacion: Ubicacion) => void;
  seleccionada: Ubicacion | null;
}

export function SelectorOrigenGuardado({ onSeleccionar, seleccionada }: Props) {
  const { direcciones, isLoading, error } = useDireccionesGuardadas();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4 border-2 border-dashed border-slate-200 rounded-xl">
        <div className="w-5 h-5 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500 font-medium">{error}</p>;
  }

  if (direcciones.length === 0) {
    return (
      <p className="text-sm text-slate-400 font-medium py-2">
        No tenés direcciones guardadas todavía.
      </p>
    );
  }

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
      {direcciones.map((dir) => {
        const ubicacion = direccionAUbicacion(dir);
        const isSelected = seleccionada?.nombre === ubicacion?.nombre;

        return (
          <button
            key={dir.id_direccion}
            type="button"
            onClick={() => onSeleccionar(ubicacion)}
            className={`w-full text-left flex items-start gap-3 px-3 py-3 rounded-xl border-2 transition-all ${
              isSelected
                ? "border-slate-900 bg-slate-50"
                : "border-slate-100 hover:border-slate-300 bg-white"
            }`}
          >
            <MapPin
              className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-slate-900" : "text-slate-400"}`}
            />
            <div>
              <p className="text-sm font-bold text-slate-900">
                {dir.direccion}
              </p>
              {dir.ciudad && (
                <p className="text-xs text-slate-400 font-medium">
                  {dir.ciudad}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
