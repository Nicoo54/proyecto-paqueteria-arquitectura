import { TicketDetalle } from "../types/ticketDetalle";

export const ticketDetalleService = {
  async obtenerDetalle(id: string): Promise<TicketDetalle> {
    const numericId = id.replace('TK-', '');
    const response = await fetch(`/api/tickets/${numericId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching ticket detalle: ${response.statusText}`);
    }

    const ticket = await response.json();
    return {
      id: `TK-${ticket.codigoReclamo}`,
      envio_id: ticket.codigoSeguimiento.toString(),
      asunto: ticket.motivo,
      descripcion: ticket.motivo, // Usamos motivo para descripcion tambien
      estado: ticket.estado,
      fecha_creacion: new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'long',
        timeStyle: 'short'
      }).format(new Date(ticket.creadoEn)),
      soporte: ticket.dniSoporteTecnico ? {
        nombre: ticket.dniSoporteTecnico,
        comentario: ticket.resolucion || "El agente está revisando tu caso.",
        conclusion: ticket.estado === 'RESUELTO' ? ticket.resolucion : undefined,
        fecha_respuesta: new Intl.DateTimeFormat('es-AR', {
          dateStyle: 'long',
          timeStyle: 'short'
        }).format(new Date(ticket.creadoEn)), // Usamos creadoEn por ahora
      } : undefined,
    };
  },
};
