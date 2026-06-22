export interface SoporteAsignado {
  nombre: string;
  comentario: string;
  conclusion?: string;
  fecha_respuesta: string;
}

export interface TicketDetalle {
  id: string;
  envio_id: string;
  asunto: string;
  descripcion: string;
  estado: string; // 'ABIERTO' | 'EN_PROGRESO' | 'RESUELTO'
  fecha_creacion: string;
  soporte?: SoporteAsignado;
}

export interface NuevoTicketPayload {
  codigo_seguimiento: string;
  motivo: string;
}

export interface NuevoTicketResponse {
  id: string;
}
