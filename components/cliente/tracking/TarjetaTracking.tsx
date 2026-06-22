import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Star,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Package,
} from "lucide-react";
import { EnvioTracking } from "@/features/remitente/types/tracking";

export default function TarjetaTracking({ envio }: { envio: EnvioTracking }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const config = {
    BUSCANDO: {
      titulo: "Buscando chofer...",
      color: "bg-slate-900",
      icon: Package,
    },
    ACEPTADO: {
      titulo: "Transportista asignado",
      color: "bg-amber-500",
      icon: MapPin,
    },
    RETIRADO: {
      titulo: "Paquete en camino",
      color: "bg-blue-600",
      icon: MapPin,
    },
    EN_CAMINO: {
      titulo: "En camino al destino",
      color: "bg-emerald-600",
      icon: MapPin,
    },
    ENTREGADO: {
      titulo: "Paquete Entregado",
      color: "bg-emerald-700",
      icon: CheckCircle2,
    },
  };

  const current =
    config[envio.estado as keyof typeof config] || config.BUSCANDO;
  const IconoEstado = current.icon;

  return (
    <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none z-10">
      <div className="max-w-md mx-auto pointer-events-auto transition-transform duration-300 ease-in-out">
        <Card className="border-slate-200 shadow-2xl rounded-3xl overflow-hidden bg-white/95 backdrop-blur-md relative">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-4 top-5 z-20 p-1 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
          >
            {isCollapsed ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          <CardContent className="p-0">
            <div
              className={`${current.color} text-white p-5 pr-14 transition-colors duration-500`}
            >
              <div className="flex items-center gap-3">
                <IconoEstado className="w-6 h-6 text-white/90" />
                <div>
                  <p className="text-white/70 font-bold text-[10px] uppercase tracking-wider">
                    Estado: {envio.estado}
                  </p>
                  <h2 className="text-lg font-black tracking-tight">
                    {current.titulo}
                  </h2>
                </div>
              </div>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? "max-h-0" : "max-h-96"}`}
            >
              {envio.chofer ? (
                <div className="p-5 flex items-center justify-between border-b border-slate-100 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-lg">
                      🛵
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {envio.chofer.nombre}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {envio.chofer.vehiculo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-xs">
                      {envio.chofer.rating}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-5 border-b border-slate-100 bg-white flex items-center gap-3 text-sm text-slate-500">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Esperando asignación de transportista...</span>
                </div>
              )}

              <div className="p-5 bg-slate-50 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Entrega en
                  </p>
                  <p className="font-semibold text-slate-900 text-sm">
                    {envio.destino_direccion}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
