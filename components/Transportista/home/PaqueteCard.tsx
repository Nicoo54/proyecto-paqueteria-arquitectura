import { Package, Navigation, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PaqueteDisponible } from "@/lib/transportista/types";

export function PaqueteCard({
  paquete,
  onClick,
}: {
  paquete: PaqueteDisponible;
  onClick: () => void;
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="bg-slate-900 border-slate-200 shadow-sm rounded-2xl overflow-hidden active:scale-[0.98] transition-transform cursor-pointer hover:shadow-md hover:border-amber-200"
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-600">
              ${paquete.ganancia.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-400">ARS</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            <Package className="w-3.5 h-3.5" /> {paquete.tamano}
          </span>
        </div>

        <div className="space-y-1.5 mb-3">
          <p className="text-sm font-bold text-white truncate flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-white text-slate-900 text-[10px] font-bold flex items-center justify-center shrink-0">
              A
            </span>
            {paquete.origen}
          </p>
          <p className="text-sm font-bold text-white truncate flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold flex items-center justify-center shrink-0">
              B
            </span>
            {paquete.destino}
          </p>
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5" /> {paquete.distancia}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {paquete.tiempoAprox}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
