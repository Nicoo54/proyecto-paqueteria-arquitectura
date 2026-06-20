
import { TicketReclamo, EstadoTicket } from './types';
import { TicketYaResueltoError } from './errors';

export const TicketReglas = {
  // RN13: El ticket pasa a "En Proceso" (EN_ATENCION) al ser tomado por el Helper
  iniciarProgreso(ticket: TicketReclamo, helperDni: string): TicketReclamo {
    if (ticket.estado === 'RESUELTO') {
      throw new TicketYaResueltoError(ticket.codigo_reclamo);
    }
    if (ticket.estado !== 'PENDIENTE') {
      throw new Error('Solo se pueden tomar tickets que estén pendientes.');
    }
    
    return {
      ...ticket,
      estado: 'EN_PROGRESO',
      helperDni: helperDni
    };
  },

 
  resolver(ticket: TicketReclamo, resolucion: string, comentarios: string): TicketReclamo {
    if (ticket.estado === 'RESUELTO') {
      throw new TicketYaResueltoError(ticket.codigo_reclamo);
    }
     // RN14: El ticket se puede resolver solo si está en progreso
    if (ticket.estado !== 'EN_PROGRESO') {
      throw new Error('El ticket debe estar en progreso para poder resolverse.');
    }

    return {
      ...ticket,
      estado: 'RESUELTO',
      resolucion: resolucion,
      comentarios_soporte: comentarios,
    };
  }
};