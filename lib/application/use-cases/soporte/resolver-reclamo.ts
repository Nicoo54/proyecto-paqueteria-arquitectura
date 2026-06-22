
import { TicketReclamo } from '../../../domain/soporte/types';
import { TicketReglas } from '../../../domain/soporte/rules';
import { TicketRepository } from '../../repositories/ticket-repository';

export class ResolverReclamoUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async ejecutar(
    codigo_reclamo: string, 
    resolucion: string, 
    comentarios_soporte: string
  ): Promise<TicketReclamo> {
    
    if (!resolucion || !comentarios_soporte) {
      throw new Error('La resolución y los comentarios de soporte son obligatorios para cerrar el caso.');
    }

    const ticket = await this.ticketRepository.obtenerPorCodigo(codigo_reclamo);
    if (!ticket) {
      throw new Error('El reclamo no existe.');
    }

    const ticketResuelto = TicketReglas.resolver(ticket, resolucion, comentarios_soporte);

    await this.ticketRepository.guardar(ticketResuelto);

    return ticketResuelto;
  }
}