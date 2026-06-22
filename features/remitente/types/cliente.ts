export interface ChoferInfo {
  nombre: string;
  vehiculo: string;
  rating: number;
}

export interface EnvioActivo {
  id: string;
  estado: string;
  origen: string;
  destino: string;
  chofer: ChoferInfo | null;
  eta: string;
}
