// lib/application/use-cases/soporte/listar-tickets-pendientes.ts
import { TicketReclamo } from '../../../domain/soporte/types';
import { TicketRepository } from '../../repositories/ticket-repository';

export class ListarTicketsPendientesUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async ejecutar(): Promise<TicketReclamo[]> {
    // Retorna únicamente la cola global de trabajo para los Helpers
    return await this.ticketRepository.obtenerPendientes();
  }
}