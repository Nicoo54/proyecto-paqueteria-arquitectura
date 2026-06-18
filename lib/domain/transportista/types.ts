import type { Dni } from "../types";
import type { Vehiculo } from "../vehiculo/types";

export const ESTADOS_TRANSPORTISTA = ["NO_DISPONIBLE", "DISPONIBLE", "OCUPADO"] as const;
export type EstadoTransportista = (typeof ESTADOS_TRANSPORTISTA)[number];

export type Transportista = {
  dni: Dni;
  aliasBancario: string;
  cantidadResenas: number;
  promedioCalificacion: number;
  estado: EstadoTransportista;
  vehiculo: Vehiculo | null;
};

export type TransportistaPublico = Omit<Transportista, "aliasBancario">;
