export type EstadoEnvio = "ACEPTADO" | "RETIRADO" | "EN_CAMINO" | "ENTREGADO";

export type EnvioDB = {
  codigo_envio: string;
  estado: EstadoEnvio;
  origen_direccion: string;
  origen_lat: number;
  origen_lng: number;
  destino_direccion: string;
  destino_lat: number;
  destino_lng: number;
};

export interface ViajeHistorial {
  codigo_envio: string;
  origen_direccion: string;
  destino_direccion: string;
  fecha: string;
  monto_ganado: number;
  zona_caliente_aplicada: boolean;
}

export interface ViajeDetalle {
  codigo_envio: string;
  fecha: string;
  origen_direccion: string;
  destino_direccion: string;
  categoria_paquete: string;
  monto_base: number;
  bonificaciones_aplicadas: {
    zona_caliente: number;
    clima_extremo: number;
  };
  monto_total_percibido: number;
}

export type Coordenada = { lat: number; lng: number };

export type Fase = "HACIA_RETIRO" | "HACIA_ENTREGA" | "LISTO_PARA_ARRANCAR";
