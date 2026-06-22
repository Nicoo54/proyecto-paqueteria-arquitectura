import { Ubicacion } from "@/shared/types/ubicacion";

export interface CotizacionRequest {
  origen: Ubicacion;
  destino: Ubicacion;
  tamano: string;
}

export interface CotizacionResponse {
  precio: number;
  eta: string;
  distancia?: string;
}

export interface TamanoPaquete {
  id: string;
  label: string;
  desc: string;
  icon: string;
}
