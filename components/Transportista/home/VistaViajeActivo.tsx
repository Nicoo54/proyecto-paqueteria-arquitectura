import { useRouter } from "next/navigation";
import { Navigation, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VistaViajeActivo({ viajeId }: { viajeId: string }) {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-sm bg-slate-900 rounded-3xl overflow-hidden border border-slate-800">
        <div className="px-6 py-8 text-center border-b border-slate-800">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-7 h-7 text-amber-500" />
          </div>
          <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">
            Viaje en curso
          </p>
          <h2 className="text-xl font-bold text-slate-100 leading-snug mb-2">
            Estás en medio de una entrega
          </h2>
          <p className="text-sm text-slate-500">
            No podés aceptar nuevos pedidos hasta completarla.
          </p>
        </div>

        <div className="p-5">
          <Button
            onClick={() => router.push(`/transportista/viaje/${viajeId}`)}
            className="w-full h-13 text-base font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 rounded-2xl"
          >
            Ir al mapa <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
