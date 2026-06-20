
export type EstadoTicket = 'PENDIENTE' | 'EN_PROGRESO' | 'RESUELTO';

export interface TicketReclamo {
  codigo_reclamo: string;     
  codigo_seguimiento: string;   
  id_remitente: string;       
  helperDni?: string | null 
  motivo: string;               
  descripcion_detallada: string;
  estado: EstadoTicket;
  comentarios_soporte?: string; 
  resolucion?: string;          
  created_at: Date;             
  resolved_at?: Date;
}