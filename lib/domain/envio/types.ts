import type { Coordenada, Dni, EnvioId } from "../types";
import type { CategoriaPaquete } from "../vehiculo/types";

export const ESTADOS_ENVIO = [
  "BUSCANDO",
  "ACEPTADO",
  "RETIRADO",
  "EN_CAMINO",
  "ENTREGADO",
  "CANCELADO",
] as const;
export type EstadoEnvio = (typeof ESTADOS_ENVIO)[number];

export const CONDICIONES_CLIMATICAS = ["DESPEJADO", "LLUVIA", "SIN_INFORMACION"] as const;
export type CondicionClimatica = (typeof CONDICIONES_CLIMATICAS)[number];

export type Envio = {
  id: EnvioId;
  categoriaPaquete: CategoriaPaquete;
  remitenteDni: Dni;
  transportistaDni: Dni | null;
  zonaCalienteId: number | null;
  origen: Coordenada & { direccion: string };
  destino: Coordenada & { direccion: string };
  condicionClimatica: CondicionClimatica | string;
  estado: EstadoEnvio;
  costo: number;
  createdAt?: string;
  updatedAt?: string;
};

export const ESTADOS_TERMINALES: readonly EstadoEnvio[] = ["ENTREGADO", "CANCELADO"];

export function estaTerminado(envio: Pick<Envio, "estado">): boolean {
  return ESTADOS_TERMINALES.includes(envio.estado);
}

export function estaDisponibleParaAceptar(envio: Pick<Envio, "estado">): boolean {
  return envio.estado === "BUSCANDO";
}

export function estaEnTransito(envio: Pick<Envio, "estado">): boolean {
  return envio.estado === "ACEPTADO" || envio.estado === "RETIRADO" || envio.estado === "EN_CAMINO";
}
