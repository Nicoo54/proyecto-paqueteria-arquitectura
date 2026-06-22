import { Button } from "@/components/ui/button";

interface Props {
  onCancelar: () => void;
  isSaving: boolean;
}

export function BotonesAccionFormulario({ onCancelar, isSaving }: Props) {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancelar}
        className="flex-1 h-12 rounded-xl font-bold"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        disabled={isSaving}
        className="flex-1 h-12 rounded-xl font-bold bg-slate-900! text-white! hover:bg-slate-800! disabled:bg-slate-300! disabled:text-slate-500!"
      >
        {isSaving ? "Guardando..." : "Guardar"}
      </Button>
    </div>
  );
}
