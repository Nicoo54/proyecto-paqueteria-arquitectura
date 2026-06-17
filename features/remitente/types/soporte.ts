export interface TicketHistorial {
  id: string;
  fecha: string;
  asunto: string;
  envio_id: string;
  soporte: string;
  estado: string; // "ABIERTO" | "EN_PROGRESO" | "RESUELTO"
}
