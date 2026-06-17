import { TicketReclamo } from '../../domain/soporte/types';

export interface TicketRepository {
 
  guardar(ticket: TicketReclamo): Promise<void>;

  obtenerPorCodigo(codigo: string): Promise<TicketReclamo | null>;
  
  obtenerTodos(): Promise<TicketReclamo[]>;
}