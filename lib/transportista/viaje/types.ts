export type EstadoEnvio = "ASIGNADO" | "EN_CAMINO" | "ENTREGADO";

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

export type Coordenada = { lat: number; lng: number };

export type Fase = "HACIA_RETIRO" | "HACIA_ENTREGA";
