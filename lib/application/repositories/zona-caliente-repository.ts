import type { Coordenada } from "../../domain/types";

export type ZonaCaliente = {
  codigo?: number;
  centro: Coordenada;
  radioM: number;
  multiplicadorPrecio: number;
  fechaVigenciaInicio: Date;
  fechaVigenciaFin: Date;
};

export interface ZonaCalienteRepository {
  vencerHasta(fecha: Date): Promise<number>;
  insertarVarias(zonas: ZonaCaliente[]): Promise<void>;
}
