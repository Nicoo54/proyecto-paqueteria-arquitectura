"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Bookmark,
  FileText,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { useHistorialDetalle } from "@/lib/hooks/soporte/useHistorialDetalle";

export default function DetalleHistorialHelperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const { ticket, isLoading } = useHistorialDetalle(id);

  if (isLoading) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => router.push("/soporte/historial")}
        className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver al archivo
      </button>

      <ResolucionHeader
        codigo_reclamo={ticket.codigo_reclamo}
        fecha_resolucion={ticket.fecha_resolucion}
      />

      <div className="space-y-6">
        <MotivoCliente motivo={ticket.motivo} />

        <RespuestaSoporte respuesta={ticket.comentarios_helper} />

        {/* BLOQUE 3: CONCLUSIÓN TÉCNICA FINAL */}
        <ResolucionSoporte resolucion={ticket.resolucion} />
      </div>
    </div>
  );
}

function ResolucionHeader({
  codigo_reclamo,
  fecha_resolucion,
}: {
  codigo_reclamo: string;
  fecha_resolucion: string;
}) {
  return (
    <div className="mb-8 pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Archivo Ticket #{codigo_reclamo}
        </h1>
        <p className="text-slate-400 text-xs font-semibold mt-1">
          Cerrado de forma definitiva el {fecha_resolucion}
        </p>
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md text-xs font-bold uppercase tracking-wider self-start sm:self-auto">
        <CheckCircle2 className="w-3.5 h-3.5" /> Cerrado e Inmutable
      </span>
    </div>
  );
}

function MotivoCliente({ motivo }: { motivo: string }) {
  return (
    <Card className="border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden">
      <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
        <FileText className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Reporte de Incidente (Cliente)
        </span>
      </div>
      <CardContent className="p-5 text-sm font-medium text-slate-700 leading-relaxed italic">
        "{motivo}"
      </CardContent>
    </Card>
  );
}

function RespuestaSoporte({ respuesta }: { respuesta: string }) {
  return (
    <Card className="border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden border-l-4 border-l-indigo-500">
      <div className="bg-slate-50/50 px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 pl-4">
        <MessageSquare className="w-4 h-4 text-indigo-500" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Tu respuesta
        </span>
      </div>
      <CardContent className="p-5 pl-4 text-sm text-slate-700 leading-relaxed font-medium">
        {respuesta}
      </CardContent>
    </Card>
  );
}

function ResolucionSoporte({ resolucion }: { resolucion: string }) {
  return (
    <Card className="border-emerald-100 shadow-sm bg-white rounded-2xl overflow-hidden border-l-4 border-l-emerald-500">
      <div className="bg-emerald-50/30 px-5 py-3.5 border-b border-emerald-100 flex items-center gap-2 pl-4">
        <Bookmark className="w-4 h-4 text-emerald-600" />
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
          Resolución Técnica Notificada
        </span>
      </div>
      <CardContent className="p-5 pl-4 bg-emerald-50/10">
        <p className="text-emerald-950 text-sm font-bold leading-relaxed">
          {resolucion}
        </p>
      </CardContent>
    </Card>
  );
}
