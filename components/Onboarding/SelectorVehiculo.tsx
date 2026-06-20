"use client";

import { Label } from "@/components/ui/label";
import { CONFIG_VEHICULOS } from "@/features/landing/context/onboardingContent";
import { CategoriaVehiculo } from "@/lib/api-contract";

interface Props {
  categoriaSeleccionada: string;
  onChange: (categoria: CategoriaVehiculo) => void;
  limpiarError: () => void;
}

export default function SelectorVehiculo({
  categoriaSeleccionada,
  onChange,
  limpiarError,
}: Props) {
  return (
    <div className="space-y-3 pt-2">
      <Label className="text-sm font-semibold text-slate-900">
        ¿Qué vehículo usás?
      </Label>

      <div className="grid grid-cols-3 gap-3">
        {CONFIG_VEHICULOS.map((veh) => (
          <button
            key={veh.id}
            type="button"
            onClick={() => {
              onChange(veh.id);
              limpiarError();
            }}
            className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all border-2 flex flex-col items-center gap-1 ${
              categoriaSeleccionada === veh.id
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-100 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <span className="text-xl">{veh.icon}</span>
            {veh.label}
          </button>
        ))}
      </div>
    </div>
  );
}
