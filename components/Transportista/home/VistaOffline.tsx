import { MapPin } from "lucide-react";

export function VistaOffline() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-100">
      <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
        <MapPin className="w-10 h-10 text-slate-400" />
      </div>
      <h2 className="text-xl font-black text-slate-700 mb-2">
        Estás desconectado
      </h2>
      <p className="text-slate-500 font-medium max-w-xs">
        Activá tu disponibilidad en el interruptor de arriba para empezar a
        recibir alertas de viajes.
      </p>
    </div>
  );
}
