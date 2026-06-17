import { Ubicacion } from "@/shared/types/ubicacion";

export interface DraftEnvio {
  origen: Ubicacion;
  destino: Ubicacion;
  tamanoSeleccionado: string;
  cotizacion: {
    precio: number;
    eta: string;
    distancia: string;
  };
}
