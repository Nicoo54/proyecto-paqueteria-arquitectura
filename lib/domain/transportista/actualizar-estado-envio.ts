import {
  CoordenadasFaltantes,
  TransicionInvalida,
  TransportistaOcupado,
} from "../errors";
import type { Envio, EstadoEnvio } from "../envio/types";
import { transicionarEnvio } from "../envio/state-machine";
import type { Coordenada } from "../types";
import type { Transportista } from "./types";
import { ponerseDisponible } from "./state-machine";

export type ContextoActualizacionEstado = {
  transportista: Transportista;
  envio: Envio;
  nuevoEstado: EstadoEnvio;
  posicionTransportista: Coordenada | null;
  otroEnvioEnTransito: Envio | null;
};

export type ResultadoActualizacionEstado = {
  transportistaActualizado: Transportista;
  envioActualizado: Envio;
};

const ESTADOS_QUE_LIBERAN_AL_TRANSPORTISTA: readonly EstadoEnvio[] = ["ENTREGADO", "CANCELADO"];
const ESTADOS_QUE_REQUIEREN_COORDS: readonly EstadoEnvio[] = ["RETIRADO", "ENTREGADO"];

export function actualizarEstadoEnvio(
  ctx: ContextoActualizacionEstado
): ResultadoActualizacionEstado {
  const { transportista, envio, nuevoEstado, posicionTransportista, otroEnvioEnTransito } = ctx;

  if (envio.transportistaDni !== transportista.dni) {
    throw new TransicionInvalida(envio.estado, nuevoEstado);
  }

  if (ESTADOS_QUE_REQUIEREN_COORDS.includes(nuevoEstado) && posicionTransportista === null) {
    throw new CoordenadasFaltantes();
  }

  if (nuevoEstado === "RETIRADO" && otroEnvioEnTransito !== null) {
    throw new TransportistaOcupado();
  }

  const envioActualizado = transicionarEnvio(envio, nuevoEstado);

  const transportistaActualizado = ESTADOS_QUE_LIBERAN_AL_TRANSPORTISTA.includes(nuevoEstado)
    ? ponerseDisponible({ ...transportista, estado: "OCUPADO" })
    : transportista;

  return { transportistaActualizado, envioActualizado };
}
