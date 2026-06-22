"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, PackageCheck } from "lucide-react";
import { useEnvioActivo } from "@/features/remitente/hooks/useEnvioActivo";

const metadata = {
  title: "Cliente menu principal - Packeteer",
  description: "Panel de control para clientes de Packeteer",
};

export default function ClienteDashboardPage() {
  const { envioActivo, isLoading } = useEnvioActivo();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-in fade-in duration-500">
      {envioActivo ? (
        <EnvioActivoCard
          origen={envioActivo.origen}
          destino={envioActivo.destino}
          nombreChofer={envioActivo.chofer?.nombre}
          vehiculoChofer={envioActivo.chofer?.vehiculo}
          ratingChofer={envioActivo.chofer?.rating}
          etapa={envioActivo.eta}
          idEnvio={envioActivo.id}
        />
      ) : (
        <CrearEnvio />
      )}
    </div>
  );
}

interface EnvioActivoCardProps {
  origen: string;
  destino: string;
  nombreChofer: string | null | undefined;
  vehiculoChofer: string | null | undefined;
  ratingChofer: number | null | undefined;
  etapa: string;
  idEnvio: string;
}

function EnvioActivoCard({
  origen,
  destino,
  nombreChofer,
  vehiculoChofer,
  ratingChofer,
  etapa,
  idEnvio,
}: EnvioActivoCardProps) {
  const tieneChofer = nombreChofer !== null && nombreChofer !== undefined;

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {tieneChofer ? "Tu envío está en curso" : "Buscando transportista"}
          </h1>
          <p className="text-slate-500 mt-1">
            {tieneChofer
              ? "El transportista ya tiene tu paquete."
              : "En cuanto alguien acepte el viaje, te avisamos."}
          </p>
        </div>

        {tieneChofer ? (
          <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            En tránsito
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
            Buscando
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-1 shadow-sm">
        <div className="bg-slate-50 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4 mb-8">
            <div className="flex flex-col items-center mt-1">
              <div className="w-3 h-3 rounded-full bg-slate-900" />
              <div className="w-0.5 h-10 bg-slate-200 my-1" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Origen
                </p>
                <p className="text-slate-900 font-medium">{origen}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Destino
                </p>
                <p className="text-slate-900 font-medium">{destino}</p>
              </div>
            </div>
          </div>

          {tieneChofer ? (
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg">
                  🛵
                </div>
                <div>
                  <p className="font-bold text-slate-900">{nombreChofer}</p>
                  <p className="text-xs text-slate-500">
                    {vehiculoChofer} • ⭐ {ratingChofer}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Llega en
                </p>
                <p className="font-black text-slate-900 text-lg">{etapa}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-dashed border-slate-200 mb-8">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                <span className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <p className="font-bold text-slate-700 text-sm">
                  Buscando un transportista cercano...
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Te notificaremos cuando alguien acepte el viaje.
                </p>
              </div>
            </div>
          )}

          <Link href={`/cliente/tracking/${idEnvio}`}>
            <Button className="w-full h-14 text-lg font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-md group">
              <Navigation className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              {tieneChofer
                ? "Abrir mapa de seguimiento en vivo"
                : "Ver estado del envío"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function CrearEnvio() {
  return (
    <div className="text-center max-w-md mx-auto">
      <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-100">
        <PackageCheck className="w-10 h-10 text-amber-500" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
        ¿Qué enviamos hoy?
      </h1>
      <p className="text-slate-500 mb-8 text-lg leading-relaxed">
        Cotizá y conectá al instante con cientos de transportistas verificados
        en tu ciudad.
      </p>

      <Link href="/cliente/cotizar">
        <Button className="h-14 px-8 text-lg font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 rounded-full shadow-md hover:-translate-y-1 transition-all">
          <MapPin className="w-5 h-5 mr-2" />
          Cotizar un envío ahora
        </Button>
      </Link>
    </div>
  );
}
