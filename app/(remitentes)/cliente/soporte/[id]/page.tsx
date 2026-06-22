"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Package,
  User,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useDetalleTicket } from "@/features/remitente/hooks/useDetalleTicket";

export default function DetalleTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();

  const { ticket, isLoading, error } = useDetalleTicket(id);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center w-full text-center">
        <p className="text-rose-500 font-bold mb-4">
          {error || "Ticket no encontrado"}
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/cliente/soporte")}
        >
          Volver a soporte
        </Button>
      </div>
    );
  }

  const isResuelto = ticket.estado === "RESUELTO";

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* BACK NAVIGATION */}
      <button
        onClick={() => router.push("/cliente/soporte")}
        className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver a soporte
      </button>

      {/* HEADER DEL TICKET */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Ticket #{ticket.id}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                isResuelto
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : ticket.estado === "EN_PROGRESO"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-amber-100 text-amber-800 border-amber-200"
              }`}
            >
              {ticket.estado.replace("_", " ")}
            </span>
          </div>
          <p className="text-slate-500 font-medium text-lg">{ticket.asunto}</p>
        </div>

        {/* BOTÓN PARA VER EL ENVÍO ASOCIADO */}
        <Button
          variant="outline"
          onClick={() => router.push(`/cliente/historial/${ticket.envio_id}`)}
          className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <Package className="w-4 h-4 mr-2" /> Envío #{ticket.envio_id}{" "}
          <ExternalLink className="w-3 h-3 ml-2 text-slate-400" />
        </Button>
      </div>

      {/* HILO DE SOPORTE */}
      <div className="space-y-6">
        {/* MENSAJE DEL CLIENTE */}
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                TÚ
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Tu reporte</p>
                <p className="text-xs text-slate-500">
                  {ticket.fecha_creacion}
                </p>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
              {ticket.descripcion}
            </p>
          </CardContent>
        </Card>

        {/* RESPUESTAS DEL Soporte (Si existen) */}
        {ticket.soporte ? (
          <Card className="border-blue-100 shadow-sm rounded-2xl overflow-hidden bg-white relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            <div className="bg-blue-50/50 px-6 py-4 border-b border-blue-100 flex items-center justify-between ml-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    Soporte Packeteer ({ticket.soporte.nombre})
                  </p>
                  <p className="text-xs text-slate-500">
                    {ticket.soporte.fecha_respuesta}
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-6 ml-1 space-y-6">
              <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                {ticket.soporte.comentario}
              </p>

              {/* CONCLUSIÓN TÉCNICA (Solo si está resuelto) */}
              {ticket.soporte.conclusion && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-900 text-sm mb-1">
                      Resolución Final
                    </h4>
                    <p className="text-emerald-800 text-sm leading-relaxed">
                      {ticket.soporte.conclusion}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 mb-1">
              Tu ticket está en la fila
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Un miembro de nuestro equipo de soporte tomará tu caso y te
              responderá por este medio a la brevedad.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
