// lib/application/use-cases/soporte/listar-historial-helper.ts
import { TicketReclamo } from '../../../domain/soporte/types';
import { TicketRepository } from '../../repositories/ticket-repository';

export class ListarHistorialHelperUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async ejecutar(helperDni: string): Promise<TicketReclamo[]> {
    // RF16: Retorna el historial de casos resueltos por el Helper autenticado [cite: 209]
    return await this.ticketRepository.obtenerResueltosPorHelper(helperDni);
  }
}