export interface TransportistaAsignado {
  nombre: string;
  vehiculo: string;
  rating: number;
}

export interface EnvioDetalle {
  codigo_envio: string;
  categoria_paquete: string;
  origen_direccion: string;
  destino_direccion: string;
  condicion_climatica: string;
  estado: string;
  costo: number;
  created_at: string;
  transportista?: TransportistaAsignado;
}
