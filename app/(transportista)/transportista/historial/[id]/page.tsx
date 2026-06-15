"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Package,
  DollarSign,
  Calendar,
  ShieldCheck,
  Flame,
  CloudSun,
} from "lucide-react";
import Link from "next/link";
import { useViajeDetalle } from "@/lib/hooks/transportista/useViajeDetalle";

export default function DetalleViajeTransportistaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const { viaje, isLoading, error } = useViajeDetalle(id);

  if (isLoading) {
    return (
      <div className="flex-1 bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!viaje || error) {
    return <ViajeNoEncontrado error={error} />;
  }

  return (
    <div className="flex-1 bg-slate-900 text-white overflow-y-auto p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <button
          onClick={() => router.push("/transportista/historial")}
          className="flex items-center text-sm font-bold text-slate-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Historial Completo
        </button>

        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Viaje #{viaje.codigo_envio}
          </h1>
          <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Cerrado el {viaje.fecha}
          </p>
        </div>

        <Trayecto
          origen={viaje.origen_direccion}
          destino={viaje.destino_direccion}
        />

        <DetallesPaquete categoria_paquete={viaje.categoria_paquete} />

        <ResumenEconomico
          monto_base={viaje.monto_base}
          bonificaciones_aplicadas={viaje.bonificaciones_aplicadas}
          monto_total_percibido={viaje.monto_total_percibido}
        />
      </div>
    </div>
  );
}

function ViajeNoEncontrado({ error }: { error?: string | null }) {
  return (
    <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <p className="text-rose-400 font-medium mb-4">
        {error || "No encontramos el viaje"}
      </p>
      <Link
        href="/transportista/historial"
        className="bg-slate-800 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors"
      >
        Volver
      </Link>
    </div>
  );
}

function Trayecto({ origen, destino }: { origen: string; destino: string }) {
  return (
    <Card className="bg-slate-800/40 border-slate-800 rounded-3xl overflow-hidden">
      <CardContent className="p-6 space-y-6">
        <div className="flex gap-4">
          <div className="flex flex-col items-center mt-1 shrink-0">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-0.5 h-12 bg-slate-700 my-1" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <div className="flex flex-col gap-6 text-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                Punto de Retiro
              </p>
              <p className="text-slate-200 font-bold leading-tight">{origen}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                Punto de Entrega
              </p>
              <p className="text-slate-200 font-bold leading-tight">
                {destino}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DetallesPaquete({ categoria_paquete }: { categoria_paquete: string }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="bg-slate-800/40 border-slate-800 rounded-2xl p-4 flex flex-col justify-center">
        <Package className="w-4 h-4 text-slate-400 mb-1" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Carga Asignada
        </span>
        <p className="text-sm font-bold text-white mt-0.5">
          {categoria_paquete}
        </p>
      </Card>
      <Card className="bg-slate-800/40 border-slate-800 rounded-2xl p-4 flex flex-col justify-center">
        <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Liquidación
        </span>
        <p className="text-sm font-bold text-emerald-400 mt-0.5">
          Acreditada en cuenta
        </p>
      </Card>
    </div>
  );
}

function ResumenEconomico({
  monto_base,
  bonificaciones_aplicadas,
  monto_total_percibido,
}: {
  monto_base: number;
  bonificaciones_aplicadas: { zona_caliente: number; clima_extremo: number };
  monto_total_percibido: number;
}) {
  return (
    <Card className="bg-slate-950 border-slate-800/80 rounded-3xl shadow-xl overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4" /> Apertura de Tarifas
        </h3>

        <div className="space-y-3 text-sm text-slate-300 border-b border-slate-800 pb-4">
          <div className="flex justify-between">
            <span>Tarifa Base del Viaje</span>
            <span className="font-medium text-white">
              ${monto_base.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-amber-400 text-xs font-semibold">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" /> Incentivo por
              Zona Caliente
            </span>
            <span>+${bonificaciones_aplicadas.zona_caliente.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-blue-400 text-xs font-semibold">
            <span className="flex items-center gap-1">
              <CloudSun className="w-3.5 h-3.5" /> Adicional Clima Adverso
            </span>
            <span>+${bonificaciones_aplicadas.clima_extremo.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-end pt-2">
          <span className="font-bold text-white text-base">
            Total Percibido
          </span>
          <div className="text-right">
            <span className="text-3xl font-black text-emerald-400">
              ${monto_total_percibido.toFixed(2)}
            </span>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">
              NETO DE COMISIÓN (ARS)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
