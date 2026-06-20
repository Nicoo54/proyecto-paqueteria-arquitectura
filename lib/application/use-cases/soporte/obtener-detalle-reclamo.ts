
import { TicketReclamo } from '../../../domain/soporte/types';
import { TicketRepository } from '../../repositories/ticket-repository';

export class ObtenerDetalleReclamoUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async ejecutar(codigo_reclamo: string): Promise<TicketReclamo> {
    const ticket = await this.ticketRepository.obtenerPorCodigo(codigo_reclamo);

    if (!ticket) {
      throw new Error(`No se encontró ningún reclamo con el código: ${codigo_reclamo}`);
    }

    return ticket;
  }
}