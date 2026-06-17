import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Star,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { EnvioTracking } from "@/features/remitente/types/tracking";

export default function TarjetaTracking({ envio }: { envio: EnvioTracking }) {
  const [isCardCollapsed, setIsCollapsed] = useState(false);

  const esEnCamino = envio.estado === "EN_CAMINO";
  const esEntregado = envio.estado === "ENTREGADO";
  const tieneChofer = envio.chofer !== undefined;

  return (
    <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none z-10">
      <div className="max-w-md mx-auto pointer-events-auto transition-transform duration-300 ease-in-out">
        <Card className="border-slate-200 shadow-2xl rounded-3xl overflow-hidden bg-white/95 backdrop-blur-md relative">
          <button
            onClick={() => setIsCollapsed(!isCardCollapsed)}
            className="absolute right-4 top-3 z-20 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
          >
            {isCardCollapsed ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <CardContent className="p-0">
            {/* ENCABEZADO DE ESTADO (3 CASOS) */}
            <div className="bg-slate-900 text-white p-5 pr-14">
              {esEnCamino ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                      Estado del envío
                    </p>
                    <h2 className="text-xl font-black tracking-tight">
                      En camino al destino
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Llega en
                    </p>
                    <p className="text-2xl font-bold text-white">~8 min</p>
                  </div>
                </div>
              ) : esEntregado ? (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                      Viaje Finalizado
                    </p>
                    <h2 className="text-xl font-black tracking-tight">
                      Paquete Entregado
                    </h2>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                    Buscando transportista
                  </p>
                  <h2 className="text-xl font-black tracking-tight animate-pulse">
                    Asignando un chofer...
                  </h2>
                </div>
              )}
            </div>

            {/* CUERPO COLAPSABLE */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${isCardCollapsed ? "max-h-0" : "max-h-96"}`}
            >
              {/* Si ya hay chofer asignado (En camino o Entregado), lo mostramos */}
              {tieneChofer ? (
                <div className="p-5 flex items-center gap-4 border-b border-slate-100 bg-white">
                  <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center text-xl border border-slate-200">
                    🛵
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {envio.chofer?.nombre}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                      <span>{envio.chofer?.vehiculo}</span>
                      <span>•</span>
                      <span className="flex items-center text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500 mr-0.5" />{" "}
                        {envio.chofer?.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 border-b border-slate-100 bg-white flex items-center gap-3 text-sm text-slate-500 font-medium">
                  <Clock className="w-4 h-4 text-amber-500 animate-spin" />
                  <span>
                    Tu envío ya fue pagado. Avisaremos cuando un chofer acepte
                    el viaje.
                  </span>
                </div>
              )}

              <div className="p-5 bg-slate-50/80 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Dirección de entrega
                  </p>
                  <p className="font-semibold text-slate-900 text-sm leading-tight">
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
