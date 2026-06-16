"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Package,
  User,
  CheckCircle2,
  ShieldAlert,
  FileText,
  Send,
} from "lucide-react";
import { useGestionTicket } from "@/features/soporte/hooks/useGestionTicket";
import { TicketGestionDetalle } from "@/features/soporte/types/ticketGestion";

export default function GestionTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const {
    ticket,
    isLoading,
    error,
    resolucionText,
    setResolucionText,
    isSaving,
    mensajeExito,
    handleResolverTicket,
  } = useGestionTicket(id);

  if (isLoading) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-rose-500 font-bold mb-4">
          {error || "Ticket no encontrado."}
        </p>
        <Button onClick={() => router.push("/soporte")} variant="outline">
          Volver a la cola
        </Button>
      </div>
    );
  }

  const isResuelto = ticket.estado === "RESUELTO";

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <NavHeader isResuelto={isResuelto} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ReclamoCard
            codigo_reclamo={ticket.codigo_reclamo}
            created_at={ticket.created_at}
            motivo={ticket.motivo}
          />

          <ContextoCard ticket={ticket} />
        </div>

        <div className="lg:col-span-2">
          <ConsolaResolucion
            mensajeExito={mensajeExito}
            handleResolverTicket={handleResolverTicket}
            resolucionText={resolucionText}
            setResolucionText={setResolucionText}
            isResuelto={isResuelto}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}

function NavHeader({ isResuelto }: { isResuelto: boolean }) {
  const router = useRouter();

  return (
    <div className="mb-6 flex items-center justify-between">
      <button
        onClick={() => router.push("/soporte")}
        className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la Cola
      </button>
      {isResuelto && (
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Caso Cerrado
        </span>
      )}
    </div>
  );
}

function ReclamoCard({
  codigo_reclamo,
  created_at,
  motivo,
}: {
  codigo_reclamo: string;
  created_at: string;
  motivo: string;
}) {
  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
      <div className="bg-slate-900 p-4 text-white">
        <h2 className="font-black flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" /> Ticket #
          {codigo_reclamo}
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Abierto: {created_at}
        </p>
      </div>
      <CardContent className="p-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Mensaje del Cliente
        </p>
        <p className="text-sm font-medium text-slate-700 bg-slate-50 p-3 border border-slate-100 rounded-xl leading-relaxed">
          "{motivo}"
        </p>
      </CardContent>
    </Card>
  );
}

function ContextoCard({ ticket }: { ticket: TicketGestionDetalle }) {
  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardHeader className="p-5 pb-0">
        <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          Contexto de Operación
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">
              Remitente
            </p>
            <p className="text-sm font-bold text-slate-900">
              {ticket.remitente.nombre} (DNI: {ticket.remitente.dni})
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 pt-4 border-t border-slate-100">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">
              Envío #{ticket.codigo_seguimiento}
            </p>
            <p className="text-xs font-medium text-slate-700">
              <span className="text-amber-500 font-bold mr-1">A:</span>{" "}
              {ticket.envio.origen}
            </p>
            <p className="text-xs font-medium text-slate-700">
              <span className="text-emerald-500 font-bold mr-1">B:</span>{" "}
              {ticket.envio.destino}
            </p>
            <p className="text-xs font-bold text-indigo-600 mt-1">
              Costo: ${ticket.envio.costo.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConsolaResolucion({
  mensajeExito,
  handleResolverTicket,
  resolucionText,
  setResolucionText,
  isResuelto,
  isSaving,
}: {
  mensajeExito: boolean;
  handleResolverTicket: (e: React.FormEvent) => void;
  resolucionText: string;
  setResolucionText: React.Dispatch<React.SetStateAction<string>>;
  isResuelto: boolean;
  isSaving: boolean;
}) {
  return (
    <Card className="border-indigo-100 shadow-md bg-white h-full flex flex-col">
      <div className="bg-indigo-50/50 p-6 border-b border-indigo-100">
        <h2 className="text-xl font-black text-indigo-950 flex items-center gap-2">
          Consola de Resolución
        </h2>
        <p className="text-sm text-indigo-700/70 font-medium mt-1">
          Registrá la conclusión técnica. Esta respuesta será notificada al
          cliente automáticamente.
        </p>
      </div>

      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="mb-6 bg-slate-50 border border-slate-200 p-3 rounded-xl flex gap-3 items-start">
          <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0" />
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            <strong className="text-slate-800">Nota Operativa:</strong> La
            ejecución de reembolsos financieros o sanciones administrativas
            queda fuera del alcance de esta consola. Solo debe registrar la
            resolución técnica del incidente.
          </p>
        </div>

        {mensajeExito && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <p className="text-sm font-bold text-emerald-800">
              El ticket ha sido cerrado y notificado al remitente.
            </p>
          </div>
        )}

        <form onSubmit={handleResolverTicket} className="flex flex-col flex-1">
          <label className="text-sm font-bold text-slate-700 mb-2">
            Conclusión Técnica
          </label>
          <textarea
            value={resolucionText}
            onChange={(e) => setResolucionText(e.target.value)}
            disabled={isResuelto || isSaving}
            placeholder="Ej: Se validaron las fotos adjuntas y se procedió a autorizar el reporte a finanzas para su reembolso..."
            className="flex-1 min-h-50 p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none disabled:opacity-70 disabled:cursor-not-allowed"
          />

          {!isResuelto && (
            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={isSaving || resolucionText.trim().length === 0}
                className="h-12 px-8 bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-xl shadow-md transition-all"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Procesando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" /> Marcar como Resuelto
                  </span>
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
