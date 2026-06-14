import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Fase } from "@/lib/transportista/viaje/types";
import { MapPin, Navigation, Clock } from "lucide-react";

interface Props {
  fase: Fase;
  direccion: string;
  distanciaTexto: string;
  duracionTexto: string;
  isUpdating: boolean;
  onConfirmar: () => void;
}

export function TarjetaNavegacion({
  fase,
  direccion,
  distanciaTexto,
  duracionTexto,
  isUpdating,
  onConfirmar,
}: Props) {
  const esRetiro = fase === "HACIA_RETIRO";

  return (
    <div className="absolute inset-x-0 bottom-0 p-4 z-10">
      <Card className="max-w-md mx-auto border-slate-200 shadow-2xl rounded-3xl overflow-hidden bg-white/95 backdrop-blur-md">
        <CardContent className="p-0">
          <div className="bg-slate-900 text-white p-5">
            <p className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              {esRetiro ? "Yendo a retirar" : "Yendo a entregar"}
            </p>
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <h2 className="text-lg font-black tracking-tight leading-tight">
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

          <div className="p-4 bg-white">
            <Button
              onClick={onConfirmar}
              disabled={isUpdating}
              className={`w-full h-14 text-lg font-bold rounded-xl ${
                esRetiro
                  ? "bg-amber-400 text-slate-900 hover:bg-amber-500"
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
              ) : (
                "Marcar como entregado"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
