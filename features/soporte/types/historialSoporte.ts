export interface TicketResuelto {
  codigo_reclamo: string;
  codigo_seguimiento: string;
  fecha_resolucion: string;
  resolucion: string;
}

export interface TicketResueltoDetalle {
  codigo_reclamo: string;
  codigo_seguimiento: string;
  motivo: string;
  comentarios_soporte: string;
  resolucion: string;
  fecha_resolucion: string;
}
