import { ApiFetch } from "@/shared/api-client";
import {
  TicketResuelto,
  TicketResueltoDetalle,
} from "@/features/soporte/types/historialSoporte";
import { formatearFecha } from "@/shared/dateUtils";

export const historialSoporteService = {
  async obtenerTicketsResueltos(apiFetch: ApiFetch): Promise<TicketResuelto[]> {
    const res = await apiFetch("/api/tickets/historial");
    return res.data.map((ticket: any) => ({
      ...ticket,
      fecha_resolucion: formatearFecha(ticket.fecha_resolucion),
    }));
  },

  async obtenerDetalleResuelto(
    id: string,
    apiFetch: ApiFetch,
  ): Promise<TicketResueltoDetalle> {
    const ticketBackend = await apiFetch(`/api/tickets/${id}`);

    return {
      codigo_reclamo: ticketBackend.codigoReclamo.toString(),
      codigo_seguimiento: ticketBackend.codigoSeguimiento.toString(),
      motivo: ticketBackend.motivo,
      comentarios_soporte: ticketBackend.resolucion
        ? `Procesado por operador: ${ticketBackend.dniSoporteTecnico}`
        : "Sin comentarios.",
      resolucion: ticketBackend.resolucion || "Pendiente de resolución",
      fecha_resolucion: formatearFecha(ticketBackend.actualizadoEn),
    };
  },
};
