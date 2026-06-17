import { Clock, MapPin, Package } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function ResumenRuta({
  origen,
  destino,
  tamano,
  eta,
}: {
  origen: string;
  destino: string;
  tamano: string;
  eta: string;
}) {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm overflow-hidden rounded-3xl">
        <CardContent className="p-0">
          <div className="p-6 border-b border-slate-100 bg-white">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" /> Ruta del viaje
            </h3>

            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-slate-900" />
                <div className="w-0.5 h-12 bg-slate-200 my-1" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Retiro
                  </p>
                  <p className="text-slate-900 font-medium">{origen}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Entrega
                  </p>
                  <p className="text-slate-900 font-medium">{destino}</p>
                </div>
              </div>
            </div>
          </div>
          {/* TODO: Cambiar a fetch */}
          <div className="p-6 bg-slate-50 flex gap-6">
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Package className="w-3 h-3" /> Tamaño
              </p>
              <p className="text-slate-900 font-bold">
                {tamano === "S"
                  ? "Pequeño"
                  : tamano === "M"
                    ? "Mediano"
                    : "Grande"}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Demora aprox.
              </p>
              <p className="text-slate-900 font-bold">{eta}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
