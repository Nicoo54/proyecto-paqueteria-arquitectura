export interface EnvioResumen {
  origen: string;
  destino: string;
  estado: string;
  costo: number;
}

export interface RemitenteResumen {
  nombre: string;
  dni: string;
}

export interface TicketGestionDetalle {
  codigo_reclamo: string;
  codigo_seguimiento: string;
  motivo: string;
  resolucion?: string;
  estado: "PENDIENTE" | "EN_PROGRESO" | "RESUELTO";
  created_at: string;
  envio: EnvioResumen;
  remitente: RemitenteResumen;
}
