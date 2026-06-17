export interface DireccionGuardada {
  id_direccion: number;
  direccion: string;
  ciudad: string | null;
  origen_lat: number;
  origen_lng: number;
}

export interface NuevaDireccionPayload {
  direccion: string;
  ciudad: string | null;
  origen_lat: number;
  origen_lng: number;
}
