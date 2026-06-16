export interface ChoferTracking {
  nombre: string;
  vehiculo: string;
  rating: number;
}

export interface EnvioTracking {
  codigo_envio: string;
  estado: string; // 'BUSCANDO_TRANSPORTISTA' | 'EN_CAMINO' | 'ENTREGADO'
  origen_direccion: string;
  origen_lat: number;
  origen_lng: number;
  destino_direccion: string;
  destino_lat: number;
  destino_lng: number;
  chofer?: ChoferTracking;
}

export interface UbicacionCoordenadas {
  lat: number;
  lng: number;
}
