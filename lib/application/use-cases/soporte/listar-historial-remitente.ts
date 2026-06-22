import { TicketReclamo } from '../../../domain/soporte/types';
import { TicketRepository } from '../../repositories/ticket-repository';

export class ListarHistorialRemitenteUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async ejecutar(remitenteDni: string): Promise<TicketReclamo[]> {
    // RF07: Retorna todos los tickets generados por un remitente específico
    return await this.ticketRepository.obtenerPorRemitente(remitenteDni);
  }
}