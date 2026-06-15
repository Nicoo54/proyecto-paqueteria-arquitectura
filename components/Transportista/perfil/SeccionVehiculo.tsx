import { Suspense } from "react";
import { Car } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TarjetaInfoPerfil } from "./TarjetaInfoPerfil";
import { TarjetaEdicionPerfil } from "./TarjetaEdicionPerfil";
import { BotonesAccionFormulario } from "./BotonesAccionFormulario";
import SelectorVehiculo from "@/components/Onboarding/SelectorVehiculo";

// TODO: Extraer a constantes
const EMOJI_POR_CATEGORIA: Record<string, string> = {
  BICI: "🚲",
  MOTO: "🛵",
  AUTO: "🚗",
};

interface Props {
  isEditing: boolean;
  onEditar: () => void;
  onCancelar: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  categoriaActual?: string;
  patenteActual?: string;
  categoria: string;
  onCambioCategoria: (categoria: string) => void;
  patente: string;
  setPatente: (v: string) => void;
  errorPatente: string | null;
  validarPatente: (valor: string, categoria: string) => void;
}

export function SeccionVehiculo({
  isEditing,
  onEditar,
  onCancelar,
  onSubmit,
  isSaving,
  categoriaActual,
  patenteActual,
  categoria,
  onCambioCategoria,
  patente,
  setPatente,
  errorPatente,
  validarPatente,
}: Props) {
  if (!isEditing) {
    return (
      <TarjetaInfoPerfil
        icono={Car}
        titulo="Tipo de Vehículo"
        onEditar={onEditar}
      >
        <div className="bg-linear-to-br from-slate-50 to-slate-100 border border-slate-100 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
            {categoriaActual ? EMOJI_POR_CATEGORIA[categoriaActual] : "🚗"}
          </div>
          <div className="min-w-0">
            <p className="font-black text-slate-900 text-base">
              {categoriaActual}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {categoriaActual === "BICI"
                ? "Exento de patente"
                : `Dominio: ${patenteActual}`}
            </p>
          </div>
        </div>
      </TarjetaInfoPerfil>
    );
  }

  return (
    <TarjetaEdicionPerfil
      titulo="Modificar Transporte"
      onCancelar={onCancelar}
      onSubmit={onSubmit}
    >
      <Suspense
        fallback={
          <div className="h-10 border border-dashed rounded-xl animate-pulse bg-slate-50" />
        }
      >
        <SelectorVehiculo
          categoriaSeleccionada={categoria}
          onChange={onCambioCategoria}
          limpiarError={() => {}}
        />
      </Suspense>

      {categoria !== "BICI" && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <Label
            htmlFor="patente"
            className="text-xs font-semibold text-slate-600"
          >
            Patente Vehicular
          </Label>
          <Input
            id="patente"
            value={patente}
            onChange={(e) => setPatente(e.target.value.toUpperCase())}
            onBlur={(e) => validarPatente(e.target.value, categoria)}
            className="h-12 text-md uppercase font-bold tracking-widest bg-slate-50 rounded-xl"
          />
          {errorPatente && (
            <p className="text-xs text-rose-500 font-bold">{errorPatente}</p>
          )}
        </div>
      )}

      <BotonesAccionFormulario onCancelar={onCancelar} isSaving={isSaving} />
    </TarjetaEdicionPerfil>
  );
}
