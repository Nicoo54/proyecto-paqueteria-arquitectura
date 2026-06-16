import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  codigoEnvio: string;
  onContinuar: () => void;
}

export function ModalEntregaCompletada({
  open,
  codigoEnvio,
  onContinuar,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nuevoEstado) => {
        if (!nuevoEstado) return;
      }}
    >
      <DialogContent
        className="sm:max-w-sm bg-white p-0 overflow-hidden rounded-3xl border-slate-200"
        showCloseButton={false}
      >
        <div className="bg-emerald-500 p-8 text-center text-white">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-3" />
          <h2 className="text-2xl font-black tracking-tight">
            ¡Entrega completada!
          </h2>
          <p className="text-emerald-50 font-medium mt-1">
            El envío #{codigoEnvio} fue marcado como entregado.
          </p>
        </div>

        <div className="p-6 text-center">
          <p className="text-slate-500 font-medium mb-6">
            Ya podés volver a buscar nuevos pedidos cerca de tu zona.
          </p>
          <Button
            onClick={onContinuar}
            className="w-full h-14 text-lg font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl"
          >
            Volver al inicio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
