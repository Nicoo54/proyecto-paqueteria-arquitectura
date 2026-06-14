import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PaqueteDisponible } from "@/lib/transportista/types";
import { Clock, Navigation } from "lucide-react";

export default function ModalDetallePaquete({
  paquete,
  isAccepting,
  onClose,
  onAceptar,
}: {
  paquete: PaqueteDisponible | null;
  isAccepting: boolean;
  onClose: () => void;
  onAceptar: () => void;
}) {
  return (
    <Dialog open={!!paquete} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden rounded-3xl border-slate-200">
        {paquete && (
          <>
            <div className="bg-slate-900 p-6 text-white text-center relative">
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-4 absolute top-2 left-1/2 -translate-x-1/2" />
              <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">
                Ganancia Neta
              </p>
              <h2 className="text-4xl font-black text-emerald-400">
                ${paquete.ganancia.toFixed(2)}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-center flex-1">
                  <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-500">Demora</p>
                  <p className="font-bold text-slate-900">
                    {paquete.tiempoAprox}
                  </p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="text-center flex-1">
                  <Navigation className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-500">Distancia</p>
                  <p className="font-bold text-slate-900">
                    {paquete.distancia}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-3 h-3 rounded-full bg-slate-900" />
                    <div className="w-0.5 h-10 bg-slate-200 my-1" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex flex-col gap-5 text-sm">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Retiro
                      </p>
                      <p className="text-slate-900 font-bold">
                        {paquete.origen}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Entrega
                      </p>
                      <p className="text-slate-900 font-bold">
                        {paquete.destino}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={onAceptar}
                disabled={isAccepting}
                className="w-full h-14 text-lg font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 rounded-xl"
              >
                {isAccepting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    Aceptando...
                  </div>
                ) : (
                  "Aceptar Viaje"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
