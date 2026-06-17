
import { TicketReclamo, EstadoTicket } from './types';
import { TicketYaResueltoError } from './errors';

export const TicketReglas = {
  // se puede empezar a trabajar en este ticket?
  iniciarProgreso(ticket: TicketReclamo): TicketReclamo {
    if (ticket.estado === 'RESUELTO') {
      throw new TicketYaResueltoError(ticket.codigo_reclamo);
    }
    
    return {
      ...ticket,
      estado: 'EN_PROGRESO'
    };
  },

  // se puede cerrar este ticket?
  resolver(ticket: TicketReclamo, resolucion: string, comentarios: string): TicketReclamo {
    if (ticket.estado === 'RESUELTO') {
      throw new TicketYaResueltoError(ticket.codigo_reclamo);
    }

    return {
      ...ticket,
      estado: 'RESUELTO',
      resolucion,
      comentarios_soporte: comentarios,
      resolved_at: new Date()
    };
  }
};