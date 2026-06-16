"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Package,
  User,
  DollarSign,
  Activity,
  CloudSun,
  Navigation,
  Star,
} from "lucide-react";

import { useDetalleEnvio } from "@/features/remitente/hooks/useDetalleEnvio";

export default function DetalleHistorialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();

  const { envio, isLoading, error } = useDetalleEnvio(id);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center w-full">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !envio) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center w-full text-center">
        <p className="text-rose-500 font-bold mb-4">
          {error || "Envío no encontrado"}
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/cliente/historial")}
        >
          Volver al historial
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => router.push("/cliente/historial")}
        className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver al historial
      </button>

      {/* BLOQUE DE TÍTULO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Envío #{envio.codigo_envio}
          </h1>
          <p className="text-slate-400 text-xs font-medium mt-1">
            Registrado el {envio.created_at}
          </p>
        </div>
        {envio.estado === "EN_CAMINO" && (
          <Button
            onClick={() =>
              router.push(`/cliente/tracking/${envio.codigo_envio}`)
            }
            className="rounded-xl font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 shadow-sm h-11"
          >
            <Navigation className="w-4 h-4 mr-2 animate-bounce" /> Ver mapa en
            vivo
          </Button>
        )}
      </div>

      {/* CUERPO CENTRAL INFORMATIVO */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-6 md:p-8 space-y-8">
            {/* RUTA */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" /> Trayecto del
                paquete
              </h3>
              <div className="flex gap-4 ml-1">
                <div className="flex flex-col items-center mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                  <div className="w-0.5 h-14 bg-slate-100 my-1" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                </div>
                <div className="flex flex-col gap-6 text-sm">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block mb-0.5">
                      Punto de Retiro (Origen)
                    </span>
                    <p className="text-slate-900 font-semibold">
                      {envio.origen_direccion}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block mb-0.5">
                      Punto de Entrega (Destino)
                    </span>
                    <p className="text-slate-900 font-semibold">
                      {envio.destino_direccion}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* GRILLA DE METADATOS TÉCNICOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              {/* CATEGORÍA */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Categoría Paquete
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {envio.categoria_paquete}
                  </p>
                </div>
              </div>

              {/* CLIMA */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Condición Climática
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {envio.condicion_climatica}
                  </p>
                </div>
              </div>

              {/* TARIFA */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Costo Abonado
                  </span>
                  <p className="font-black text-slate-900 text-base mt-0.5">
                    ${envio.costo.toFixed(2)} ARS
                  </p>
                </div>
              </div>

              {/* ESTADO */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Estado de Operación
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5 flex items-center gap-1.5">
                    {envio.estado === "EN_CAMINO" && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                    {envio.estado === "ENTREGADO" && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                    {envio.estado.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* TRANSPORTISTA */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <User className="w-4 h-4 text-slate-400" /> Transportista
                Asignado
              </h3>

              {envio.transportista ? (
                <div className="p-4 bg-slate-50/60 border border-slate-100 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    {envio.transportista.nombre.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      {envio.transportista.nombre}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {envio.transportista.vehiculo} • ⭐{" "}
                      {envio.transportista.rating}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/30 text-slate-400 font-medium text-sm">
                  Aún no se ha asignado un conductor para este viaje.
                </div>
              )}
            </div>

            {/* TODO: SISTEMA DE CALIFICACIÓN */}
            {envio.estado === "ENTREGADO" && envio.transportista && (
              <div className="pt-6 border-t border-slate-100">
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-amber-900 text-sm">
                      ¿Cómo fue tu experiencia?
                    </p>
                    <p className="text-xs text-amber-700">
                      Calificá a {envio.transportista.nombre} para ayudar a la
                      comunidad.
                    </p>
                  </div>
                  <Button className="bg-amber-400 text-slate-900 hover:bg-amber-500 font-bold w-full sm:w-auto">
                    <Star className="w-4 h-4 mr-2" /> Calificar Viaje
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
