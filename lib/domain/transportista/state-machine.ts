import { TransicionInvalida, VehiculoNoRegistrado } from "../errors";
import type { Transportista, EstadoTransportista } from "./types";

const TRANSICIONES_VALIDAS: Record<EstadoTransportista, EstadoTransportista[]> = {
  NO_DISPONIBLE: ["DISPONIBLE"],
  DISPONIBLE: ["NO_DISPONIBLE", "OCUPADO"],
  OCUPADO: ["DISPONIBLE", "NO_DISPONIBLE"],
};

export function puedeTransicionar(
  desde: EstadoTransportista,
  hasta: EstadoTransportista
): boolean {
  return TRANSICIONES_VALIDAS[desde].includes(hasta);
}

export function transicionarTransportista(
  transportista: Transportista,
  hasta: EstadoTransportista
): Transportista {
  if (transportista.estado === hasta) {
    return transportista;
  }

  if (!puedeTransicionar(transportista.estado, hasta)) {
    throw new TransicionInvalida(transportista.estado, hasta);
  }

  if (hasta === "DISPONIBLE" && transportista.vehiculo === null) {
    throw new VehiculoNoRegistrado();
  }

  return { ...transportista, estado: hasta };
}

export function ponerseDisponible(transportista: Transportista): Transportista {
  return transicionarTransportista(transportista, "DISPONIBLE");
}

export function ponerseNoDisponible(transportista: Transportista): Transportista {
  return transicionarTransportista(transportista, "NO_DISPONIBLE");
}

export function marcarOcupado(transportista: Transportista): Transportista {
  return transicionarTransportista(transportista, "OCUPADO");
}
