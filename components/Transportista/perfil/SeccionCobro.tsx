import { Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TarjetaInfoPerfil } from "./TarjetaInfoPerfil";
import { TarjetaEdicionPerfil } from "./TarjetaEdicionPerfil";
import { BotonesAccionFormulario } from "./BotonesAccionFormulario";

interface Props {
  isEditing: boolean;
  onEditar: () => void;
  onCancelar: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  aliasActual?: string;
  aliasBancario: string;
  setAliasBancario: (v: string) => void;
  errorAlias: string | null;
  validarAlias: (valor: string) => void;
}

export function SeccionCobro({
  isEditing,
  onEditar,
  onCancelar,
  onSubmit,
  isSaving,
  aliasActual,
  aliasBancario,
  setAliasBancario,
  errorAlias,
  validarAlias,
}: Props) {
  if (!isEditing) {
    return (
      <TarjetaInfoPerfil
        icono={Wallet}
        titulo="Cuenta de Cobros"
        onEditar={onEditar}
      >
        <div className="bg-linear-to-br from-slate-50 to-slate-100 border border-slate-100 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">
              CBU / Alias
            </p>
            <p className="font-bold text-slate-800 text-sm font-mono break-all">
              {aliasActual}
            </p>
          </div>
        </div>
      </TarjetaInfoPerfil>
    );
  }

  return (
    <TarjetaEdicionPerfil
      titulo="Modificar Cuenta Cobro"
      onCancelar={onCancelar}
      onSubmit={onSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor="alias" className="text-xs font-semibold text-slate-600">
          Nuevo CBU o Alias Bancario
        </Label>
        <Input
          id="alias"
          value={aliasBancario}
          onChange={(e) => setAliasBancario(e.target.value.toLowerCase())}
          onBlur={(e) => validarAlias(e.target.value)}
          className="h-12 bg-slate-50 rounded-xl font-mono text-sm"
          placeholder="Ej: mercadopago.alias.chofer"
        />
        {errorAlias && (
          <p className="text-xs text-rose-500 font-bold">{errorAlias}</p>
        )}
      </div>

      <BotonesAccionFormulario onCancelar={onCancelar} isSaving={isSaving} />
    </TarjetaEdicionPerfil>
  );
}
