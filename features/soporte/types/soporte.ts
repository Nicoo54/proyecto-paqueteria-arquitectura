export interface TicketPendiente {
  codigo_reclamo: string;
  codigo_seguimiento: string;
  motivo: string;
  estado: "PENDIENTE" | "EN_PROGRESO" | "RESUELTO";
  created_at: string;
}
