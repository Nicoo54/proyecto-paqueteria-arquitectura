import { TicketHistorial } from "../types/soporte";

export const soporteService = {
  async obtenerHistorialTickets(): Promise<TicketHistorial[]> {
    const response = await fetch("/api/usuarios/me/tickets");
    
    if (!response.ok) {
      console.error("Error fetching tickets", response.statusText);
      return [];
    }

    const json = await response.json();
    return json.data.map((ticket: any) => ({
      id: `TK-${ticket.codigoReclamo}`,
      fecha: new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(new Date(ticket.creadoEn)),
      asunto: ticket.motivo,
      envio_id: ticket.codigoSeguimiento.toString(),
      soporte: ticket.dniSoporteTecnico || "Sin asignar",
      estado: ticket.estado,
    }));
  },
};
