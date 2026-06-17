import { TicketReclamo } from '../../../domain/soporte/types';
import { TicketRepository } from '../../repositories/ticket-repository';

export class CrearReclamoUseCase {
  
  constructor(private ticketRepository: TicketRepository) {}

  async ejecutar(
    codigo_seguimiento: string, 
    id_remitente: string, 
    motivo: string, 
    descripcion_detallada: string
  ): Promise<TicketReclamo> {
    
    const nuevoTicket: TicketReclamo = {
      codigo_reclamo: crypto.randomUUID(),
      codigo_seguimiento,
      id_remitente,
      motivo,
      descripcion_detallada,
      estado: 'PENDIENTE',
      created_at: new Date(),
    };

    await this.ticketRepository.guardar(nuevoTicket);

    return nuevoTicket;
  }
}