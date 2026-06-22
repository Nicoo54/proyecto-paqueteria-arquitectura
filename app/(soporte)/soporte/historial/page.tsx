"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  History,
  ShieldCheck,
} from "lucide-react";
import { TicketResuelto } from "@/features/soporte/types/historialSoporte";
import { useHistorialSoporte } from "@/features/soporte/hooks/useHistorialSoporte";

export default function HistorialResueltosPage() {
  const router = useRouter();
  const { tickets, isLoading } = useHistorialSoporte();

  if (isLoading) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <button
          onClick={() => router.push("/soporte")}
          className="flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
        </button>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Mis Intervenciones <History className="w-6 h-6 text-indigo-500" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Contexto histórico de todos tus incidentes resueltos
        </p>
      </div>

      {tickets.length === 0 ? (
        <HistorialVacio />
      ) : (
        <HistorialTickets tickets={tickets} />
      )}
    </div>
  );
}

function HistorialVacio() {
  return (
    <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6">
      <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-3" />
      <h3 className="font-bold text-slate-700 mb-0.5">
        Sin intervenciones registradas
      </h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto">
        Aún no has resuelto ni registrado ninguna conclusión técnica.
      </p>
    </div>
  );
}

function HistorialTickets({ tickets }: { tickets: TicketResuelto[] }) {
  const router = useRouter();

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl bg-white">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Envío</th>
                <th className="px-6 py-4">Fecha Cierre</th>
                <th className="px-6 py-4">Conclusión Técnica Registrada</th>
                <th className="px-6 py-4 text-center">Revisión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tickets.map((ticket) => (
                <TicketRow key={ticket.codigo_reclamo} ticket={ticket} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function TicketRow({ ticket }: { ticket: TicketResuelto }) {
  const router = useRouter();

  return (
    <tr
      key={ticket.codigo_reclamo}
      className="hover:bg-slate-50/40 transition-colors"
    >
      <td className="px-6 py-4 font-bold text-slate-900">
        #{ticket.codigo_reclamo}
      </td>
      <td className="px-6 py-4 font-semibold text-slate-600">
        #{ticket.codigo_seguimiento}
      </td>
      <td className="px-6 py-4 text-xs font-semibold text-indigo-600 whitespace-nowrap">
        {ticket.fecha_resolucion}
      </td>
      <td className="px-6 py-4 max-w-xs truncate text-slate-500 italic">
        "{ticket.resolucion}"
      </td>
      <td className="px-6 py-4 text-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            router.push(`/soporte/historial/${ticket.codigo_reclamo}`)
          }
          className="h-9 px-3 rounded-lg border-slate-200 font-bold text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all"
        >
          <Eye className="w-4 h-4 mr-1" /> Ver Caso
        </Button>
      </td>
    </tr>
  );
}
