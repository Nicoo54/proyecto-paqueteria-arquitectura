export type TamanoPaquete = {
  id: string;
  label: string;
  desc: string;
  icon: string;
};

export type EnvioDB = {
  codigo_envio: string;
  estado: string;
  origen_direccion: string;
  origen_lat: number;
  origen_lng: number;
  destino_direccion: string;
  destino_lat: number;
  destino_lng: number;
  chofer?: { nombre: string; vehiculo: string; rating: number };
};
