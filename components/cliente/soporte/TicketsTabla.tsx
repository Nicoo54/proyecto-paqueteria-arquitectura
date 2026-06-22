import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { TicketHistorial } from "@/features/remitente/types/soporte";

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

interface TicketsTablaProps {
  tickets: TicketHistorial[];
}

export default function TicketsTabla({ tickets }: TicketsTablaProps) {
  const router = useRouter();

  return (
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
              {tickets.map((ticket) => (
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
        {tickets.length === 0 && (
          <div className="p-12 text-center text-slate-400 font-medium">
            No tenés tickets de soporte abiertos ni en el historial.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
