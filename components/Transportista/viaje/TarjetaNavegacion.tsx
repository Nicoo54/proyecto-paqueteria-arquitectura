import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Fase } from "@/features/transportista/viaje/types";
import {
  MapPin,
  Navigation,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Props {
  fase: Fase;
  direccion: string;
  distanciaTexto: string;
  duracionTexto: string;
  isUpdating: boolean;
  puedeConfirmar: boolean;
  tieneGps: boolean;
  onConfirmar: () => void;
}

export function TarjetaNavegacion({
  fase,
  direccion,
  distanciaTexto,
  duracionTexto,
  isUpdating,
  puedeConfirmar,
  tieneGps,
  onConfirmar,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(true);

  const esRetiro = fase === "HACIA_RETIRO";
  const esArranque = fase === "LISTO_PARA_ARRANCAR";
  const esEntrega = fase === "HACIA_ENTREGA";

  const mensajeBloqueo = !tieneGps
    ? "Activá tu ubicación para continuar"
    : !puedeConfirmar
      ? `Acercate al punto de ${esRetiro ? "retiro" : "entrega"} para confirmar`
      : null;

  return (
    <div className="absolute inset-x-0 bottom-0 p-4 z-10">
      <Card className="max-w-md mx-auto border-slate-200 shadow-2xl rounded-3xl overflow-hidden bg-white/95 backdrop-blur-md">
        <CardContent className="p-0">
          {/* 1. HEADER CLICKABLE PARA COLAPSAR */}
          <div
            className="bg-slate-900 text-white p-5 flex items-center justify-between cursor-pointer active:bg-slate-800 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex-1 pr-4">
              <p className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                {esRetiro
                  ? "Yendo a retirar"
                  : esArranque
                    ? "Paquete a bordo"
                    : "Yendo a entregar"}
              </p>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <h2 className="text-lg font-black tracking-tight leading-tight line-clamp-2">
                  {direccion}
                </h2>
              </div>

              {(distanciaTexto || duracionTexto) && (
                <div className="flex gap-4 mt-3 text-xs font-bold text-slate-300">
                  {distanciaTexto && (
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" /> {distanciaTexto}
                    </span>
                  )}
                  {duracionTexto && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {duracionTexto}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 2. ICONO INDICADOR */}
            <div className="shrink-0 bg-slate-800 p-2 rounded-full text-slate-400 transition-transform duration-300 hover:text-white">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </div>
          </div>

          {/* 3. BODY ANIMADO CON CSS GRID (El truco mágico para animar alturas) */}
          <div
            className={`grid transition-all duration-300 ease-in-out bg-white ${
              isExpanded
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="p-4">
                <Button
                  onClick={onConfirmar}
                  disabled={isUpdating || (!puedeConfirmar && !esArranque)}
                  className={`w-full h-14 text-lg font-bold rounded-xl ${
                    esRetiro
                      ? "bg-amber-400 text-slate-900 hover:bg-amber-500"
                      : esArranque
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  {isUpdating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      Actualizando...
                    </div>
                  ) : esRetiro ? (
                    "Marcar como retirado"
                  ) : esArranque ? (
                    "Iniciar viaje al destino"
                  ) : (
                    "Marcar como entregado"
                  )}
                </Button>

                {mensajeBloqueo && !esArranque && (
                  <p className="text-center text-xs font-bold text-slate-400 mt-2">
                    {mensajeBloqueo}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
