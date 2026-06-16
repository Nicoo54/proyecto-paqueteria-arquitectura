"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, MessageSquarePlus, LifeBuoy } from "lucide-react";

// TODO: Cambiar a fetch a la api
const ticketsMock = [
  {
    id: "TK-4092",
    fecha: "15 Jun, 2026",
    asunto: "Paquete dañado",
    envio_id: "1004",
    soporte: "María L.",
    estado: "EN_PROGRESO",
  },
  {
    id: "TK-4085",
    fecha: "12 Jun, 2026",
    asunto: "Demora en la recolección",
    envio_id: "1003",
    soporte: "Juan P.",
    estado: "RESUELTO",
  },
  {
    id: "TK-4011",
    fecha: "02 Jun, 2026",
    asunto: "Chofer no respondía",
    envio_id: "1001",
    soporte: "Sin asignar",
    estado: "ABIERTO",
  },
];

export default function HistorialTicketsPage() {
  const router = useRouter();

  const getBadgeStyles = (estado: string) => {
    switch (estado) {
      case "RESUELTO":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "EN_PROGRESO":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ABIERTO":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      {/* HEADER CONTROLES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => router.push("/cliente")}
            className="flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Soporte <LifeBuoy className="w-8 h-8 text-amber-500" />
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Historial de tus consultas y reclamos técnicos.
          </p>
        </div>

        <Button className="rounded-xl font-bold bg-amber-400 text-slate-900 hover:bg-amber-500 shadow-sm h-11 px-6">
          <MessageSquarePlus className="w-4 h-4 mr-2" /> Nuevo Ticket
        </Button>
      </div>

      {/* TABLA DE TICKETS */}
      <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Ticket</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Asunto</th>
                  <th className="px-6 py-4">Soporte asignado</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {ticketsMock.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900">
                      #{ticket.id}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{ticket.fecha}</td>
                    <td className="px-6 py-4 font-medium max-w-50 truncate">
                      {ticket.asunto}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {ticket.soporte}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeStyles(ticket.estado)}`}
                      >
                        {ticket.estado.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 px-3 rounded-lg border-slate-200 font-medium text-slate-700 hover:bg-slate-900 hover:text-white transition-all"
                        onClick={() =>
                          router.push(`/cliente/soporte/${ticket.id}`)
                        }
                      >
                        <Eye className="w-4 h-4 mr-1.5" /> Leer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ticketsMock.length === 0 && (
            <div className="p-12 text-center text-slate-400 font-medium">
              No tenés tickets de soporte abiertos ni en el historial.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
