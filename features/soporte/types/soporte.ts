export interface TicketPendiente {
  codigo_reclamo: string;
  codigo_seguimiento: string;
  motivo: string;
  estado: "ABIERTO";
  created_at: string;
}
