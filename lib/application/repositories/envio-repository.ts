import type { Coordenada, Dni, EnvioId } from "../../domain/types";
import type { Envio } from "../../domain/envio/types";

export type FiltroExplorarEnvios = {
  posicion: Coordenada;
  radioKm: number;
  categoriasAdmitidas: readonly ("S" | "M" | "L")[];
};

export type PaginacionParams = {
  page: number;
  limit: number;
};

export type PaginacionResultado<T> = {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export interface EnvioRepository {
  obtenerPorId(id: EnvioId): Promise<Envio | null>;

  guardar(envio: Envio): Promise<Envio>;

  explorarDisponibles(filtro: FiltroExplorarEnvios): Promise<Envio[]>;

  obtenerEnTransitoDelTransportista(dni: Dni): Promise<Envio | null>;

  historialDelTransportista(
    dni: Dni,
    params: PaginacionParams
  ): Promise<PaginacionResultado<Envio>>;

  listarEnRango(desde: Date, hasta: Date): Promise<Envio[]>;
}
