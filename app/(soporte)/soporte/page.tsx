"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowUpRight, RefreshCw, Ticket } from "lucide-react";
import { useColaTickets } from "@/features/soporte/hooks/useColaTickets";
import { TicketPendiente } from "@/features/soporte/types/soporte";

export default function ColaSoportePage() {
  const router = useRouter();
  const {
    tickets,
    isLoading,
    isActionProcessing,
    asignarTicketASoporte,
    refrescarCola,
  } = useColaTickets();

  if (isLoading) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Cola de Reclamos Pendientes
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Tickets pendientes a revisar.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refrescarCola}
          className="h-10 px-4 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 font-bold self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Actualizar Cola
        </Button>
      </div>

      <div className="space-y-4">
        {tickets.length === 0 ? (
          <ColaVacia />
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.codigo_reclamo}
              ticket={ticket}
              isActionProcessing={isActionProcessing}
              asignarTicketASoporte={asignarTicketASoporte}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ColaVacia() {
  return (
    <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6">
      <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto mb-3" />
      <h3 className="font-bold text-slate-700 mb-0.5">
        Sin Reclamos Pendientes
      </h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto">
        No hay incidentes ni reclamos sin asignar en este momento. ¡Gran
        trabajo!
      </p>
    </div>
  );
}

function TicketCard({
  ticket,
  isActionProcessing,
  asignarTicketASoporte,
}: {
  ticket: TicketPendiente;
  isActionProcessing: string | null;
  asignarTicketASoporte: (
    codigo_reclamo: string,
    onSuccess: () => void,
  ) => void;
}) {
  const router = useRouter();

  return (
    <Card
      key={ticket.codigo_reclamo}
      className="border-slate-200/80 shadow-sm rounded-2xl bg-white overflow-hidden hover:shadow-md transition-all border-l-4 border-l-indigo-500"
    >
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <HeaderCard
            codigo_reclamo={ticket.codigo_reclamo}
            codigo_seguimiento={ticket.codigo_seguimiento}
            created_at={ticket.created_at}
          />

          <p className="text-slate-700 text-sm leading-relaxed font-medium pr-4">
            {ticket.motivo}
          </p>
        </div>

        <AtenderTicketButton
          codigo_reclamo={ticket.codigo_reclamo}
          isProcessing={isActionProcessing === ticket.codigo_reclamo}
          onSuccess={() => {
            router.push(`/soporte/ticket/${ticket.codigo_reclamo}`);
          }}
          asignarTicketASoporte={asignarTicketASoporte}
        />
      </CardContent>
    </Card>
  );
}

function HeaderCard({
  codigo_reclamo,
  codigo_seguimiento,
  created_at,
}: {
  codigo_reclamo: string;
  codigo_seguimiento: string;
  created_at: string;
}) {
  return (
    <div className="flex items-center gap-2.5 text-xs">
      <span className="font-mono bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-bold">
        Ticket #{codigo_reclamo}
      </span>
      <span className="text-slate-400 font-medium">•</span>
      <span className="text-slate-400 font-medium flex items-center gap-1">
        Envío asociado:{" "}
        <span className="font-bold text-slate-600">#{codigo_seguimiento}</span>
      </span>
      <span className="text-slate-400 font-medium">•</span>
      <span className="text-indigo-500 font-bold">{created_at}</span>
    </div>
  );
}

function AtenderTicketButton({
  codigo_reclamo,
  isProcessing,
  onSuccess,
  asignarTicketASoporte,
}: {
  codigo_reclamo: string;
  isProcessing: boolean;
  onSuccess: () => void;
  asignarTicketASoporte: (
    codigo_reclamo: string,
    onSuccess: () => void,
  ) => void;
}) {
  const router = useRouter();

  return (
    <Button
      disabled={isProcessing}
      onClick={() => {
        asignarTicketASoporte(codigo_reclamo, () => {
          router.push(`/soporte/ticket/${codigo_reclamo}`);
        });
      }}
      className="h-11 px-5 bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-xl shadow-sm tracking-wide self-start sm:self-auto shrink-0 flex items-center gap-1.5"
    >
      {isProcessing ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          Atender Caso <ArrowUpRight className="w-4 h-4" />
        </>
      )}
    </Button>
  );
}
