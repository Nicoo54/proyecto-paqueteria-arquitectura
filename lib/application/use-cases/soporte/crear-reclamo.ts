import { TicketReclamo } from '../../../domain/soporte/types';
import { TicketRepository, EnvioValidationRepository } from '../../repositories/ticket-repository';

export class CrearReclamoUseCase {
  
  constructor(
    private ticketRepository: TicketRepository,
    // Inyectamos el validador de envíos
    private envioValidationRepository: EnvioValidationRepository 
  ) {}

  async ejecutar(
    codigo_seguimiento: string, 
    id_remitente: string, 
    motivo: string, 
    descripcion_detallada: string
  ): Promise<TicketReclamo> {
    
    const detallesEnvio = await this.envioValidationRepository.obtenerDetallesBasicos(codigo_seguimiento);

    if (!detallesEnvio) {
        throw new Error('El envío especificado no existe.');
    }
    if (detallesEnvio.remitenteDni !== id_remitente) {
        throw new Error('No tienes permisos para abrir un reclamo sobre este envío.');
    }
    //RF05: El envío debe estar asignado a un transportista (Aceptado, En Camino, Entregado)
    const estadosPermitidos = ['Aceptado', 'En Camino', 'Entregado'];
    if (!estadosPermitidos.includes(detallesEnvio.estado)) {
        throw new Error('Solo se pueden generar reclamos para envíos que ya han sido asignados a un transportista.');
    }

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