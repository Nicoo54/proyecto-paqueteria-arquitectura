import { TicketReclamo } from '../../domain/soporte/types';

export interface TicketRepository {
  guardar(ticket: TicketReclamo): Promise<TicketReclamo>;
  obtenerPorCodigo(id: string): Promise<TicketReclamo | null>;

  obtenerPendientes(): Promise<TicketReclamo[]>; 
  obtenerPorRemitente(remitenteDni: string): Promise<TicketReclamo[]>;
  obtenerResueltosPorHelper(helperDni: string): Promise<TicketReclamo[]>;
}

export interface EnvioValidationRepository {
  obtenerDetallesBasicos(codigo_seguimiento: string): Promise<{ estado: string, remitenteDni: string } | null>;
}