"use client";

import { cotizacionService } from "@/features/remitente/services/cotizacionService";
import { use } from "react";

const tamanosPromise = cotizacionService.obtenerTamanosDisponibles();

interface SelectorTamanoProps {
  tamanoSeleccionado: string;
  onSelect: (id: string) => void;
}

export default function SelectorTamanos({
  tamanoSeleccionado,
  onSelect,
}: SelectorTamanoProps) {
  const tamanos = tamanosPromise;

  return (
    <div className="grid grid-cols-3 gap-3">
      {tamanos.map((tam) => (
        <button
          key={tam.id}
          type="button"
          onClick={() => onSelect(tam.id)}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 ${
            tamanoSeleccionado === tam.id
              ? "border-slate-900 bg-slate-900 text-white shadow-md"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <span className="text-2xl mb-1">{tam.icon}</span>
          <span className="font-bold text-sm">{tam.label}</span>
          <span
            className={`text-[10px] mt-1 text-center leading-tight ${tamanoSeleccionado === tam.id ? "text-slate-300" : "text-slate-400"}`}
          >
            {tam.desc}
          </span>
        </button>
      ))}
    </div>
  );
}
