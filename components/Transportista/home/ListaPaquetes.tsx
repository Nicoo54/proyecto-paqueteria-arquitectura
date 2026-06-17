import { PaqueteCard } from "./PaqueteCard";
import { PaqueteDisponible } from "@/features/transportista/types/types";

export function ListaPaquetes({
  paquetes,
  onSeleccionar,
}: {
  paquetes: PaqueteDisponible[];
  onSeleccionar: (p: PaqueteDisponible) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-4 pb-24">
      <div className="max-w-xl mx-auto space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-slate-500 uppercase tracking-wider text-xs">
            Ofertas Cercanas ({paquetes.length})
          </h2>
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>

        {paquetes.map((paquete) => (
          <PaqueteCard
            key={paquete.id}
            paquete={paquete}
            onClick={() => onSeleccionar(paquete)}
          />
        ))}

        {paquetes.length === 0 && (
          <div className="py-12 text-center text-slate-400 font-medium">
            No hay paquetes compatibles en tu zona en este momento.
          </div>
        )}
      </div>
    </div>
  );
}
