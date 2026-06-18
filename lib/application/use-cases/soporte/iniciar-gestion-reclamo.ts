
import { TicketReclamo } from '../../../domain/soporte/types';
import { TicketReglas } from '../../../domain/soporte/rules';
import { TicketRepository } from '../../repositories/ticket-repository';

export class IniciarGestionReclamoUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async ejecutar(codigo_reclamo: string, helperDni: string): Promise<TicketReclamo> {
    const ticket = await this.ticketRepository.obtenerPorCodigo(codigo_reclamo);
    if (!ticket) {
      throw new Error('El reclamo no existe.');
    }

    // RF14: Vinculamos el Helper al ticket y cambiamos el estado
    const ticketActualizado = TicketReglas.iniciarProgreso(ticket, helperDni);

    return await this.ticketRepository.guardar(ticketActualizado);
  }
}