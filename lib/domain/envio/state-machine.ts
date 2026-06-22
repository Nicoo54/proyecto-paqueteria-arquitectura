import { TransicionInvalida } from "../errors";
import type { Envio, EstadoEnvio } from "./types";

const TRANSICIONES_VALIDAS: Record<EstadoEnvio, EstadoEnvio[]> = {
  BUSCANDO: ["ACEPTADO", "CANCELADO"],
  ACEPTADO: ["RETIRADO", "CANCELADO"],
  RETIRADO: ["EN_CAMINO", "CANCELADO"],
  EN_CAMINO: ["ENTREGADO", "CANCELADO"],
  ENTREGADO: [],
  CANCELADO: [],
};

export function puedeTransicionarEnvio(desde: EstadoEnvio, hasta: EstadoEnvio): boolean {
  return TRANSICIONES_VALIDAS[desde].includes(hasta);
}

export function transicionarEnvio(envio: Envio, hasta: EstadoEnvio): Envio {
  if (envio.estado === hasta) {
    return envio;
  }
  if (!puedeTransicionarEnvio(envio.estado, hasta)) {
    throw new TransicionInvalida(envio.estado, hasta);
  }
  return { ...envio, estado: hasta };
}

export const TRANSICIONES_DE_TRANSPORTISTA: readonly EstadoEnvio[] = [
  "ACEPTADO",
  "RETIRADO",
  "EN_CAMINO",
  "ENTREGADO",
];

export function esTransicionDeTransportista(estado: EstadoEnvio): boolean {
  return TRANSICIONES_DE_TRANSPORTISTA.includes(estado);
}
