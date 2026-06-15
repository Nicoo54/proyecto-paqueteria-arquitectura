"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Flame,
  DollarSign,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useViajesHistorial } from "@/lib/hooks/transportista/useViajesHistorial";
import { ViajeHistorial } from "@/lib/transportista/viaje/types";

export default function HistorialViajesPage() {
  const router = useRouter();
  const { viajes, totalGanado, isLoading, error } = useViajesHistorial();

  if (isLoading) {
    return (
      <div className="flex-1 bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-900 text-white overflow-y-auto p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <button
          onClick={() => router.push("/transportista")}
          className="flex items-center text-xs font-bold text-slate-400 hover:text-white transition-colors mt-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
        </button>

        {viajes.length === 0 ? (
          <SinViajes />
        ) : (
          <HistorialViajes
            viajes={viajes}
            totalGanado={totalGanado}
            router={router}
          />
        )}
      </div>
    </div>
  );
}

function SinViajes() {
  return (
    <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl p-6 bg-slate-900/40">
      <p className="text-slate-500 font-medium text-sm">
        Aún no realizaste ningún viaje en la plataforma. ¡Conectate en el radar
        para empezar a facturar!
      </p>
    </div>
  );
}

function HistorialViajes({
  viajes,
  totalGanado,
  router,
}: {
  viajes: ViajeHistorial[];
  totalGanado: number;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="space-y-3">
      <BalanceTotal totalGanado={totalGanado} />
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
        Tus Viajes Completados
      </h2>

      {viajes.map((viaje) => (
        <ViajeCard key={viaje.codigo_envio} viaje={viaje} router={router} />
      ))}
    </div>
  );
}

function BalanceTotal({ totalGanado }: { totalGanado: number }) {
  return (
    <Card className="bg-linear-to-br from-slate-800 to-slate-950 border-slate-800 rounded-3xl shadow-xl overflow-hidden">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">
            Billetera Total
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white">
            ${totalGanado.toFixed(2)}
          </h1>
          <p className="text-[10px] text-emerald-400 font-semibold mt-1">
            Plataforma Activa • ARS
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <DollarSign className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  );
}

function ViajeCard({
  viaje,
  router,
}: {
  viaje: ViajeHistorial;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <Card
      key={viaje.codigo_envio}
      onClick={() =>
        router.push(`/transportista/historial/${viaje.codigo_envio}`)
      }
      className="bg-slate-800/60 border-slate-800/80 rounded-2xl text-white shadow-sm active:scale-[0.99] transition-transform cursor-pointer overflow-hidden"
    >
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          {/* Fecha e ID */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{viaje.fecha}</span>
            <span>•</span>
            <span className="font-bold text-slate-300">
              #{viaje.codigo_envio}
            </span>
          </div>

          {/* Trayecto Cortado */}
          <div className="space-y-0.5 text-sm font-semibold text-slate-200">
            <p className="truncate">
              <span className="text-amber-400 font-bold mr-1">A:</span>{" "}
              {viaje.origen_direccion}
            </p>
            <p className="truncate">
              <span className="text-emerald-400 font-bold mr-1">B:</span>{" "}
              {viaje.destino_direccion}
            </p>
          </div>

          {/* Badge de Zona Caliente */}
          {viaje.zona_caliente_aplicada && (
            <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              <Flame className="w-3 h-3 fill-amber-400" /> +Zona Caliente
            </span>
          )}
        </div>

        {/* Ganancia del viaje */}
        <div className="text-right flex items-center gap-2 shrink-0">
          <span className="text-lg font-black text-emerald-400">
            ${viaje.monto_ganado.toFixed(2)}
          </span>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </div>
      </CardContent>
    </Card>
  );
}
