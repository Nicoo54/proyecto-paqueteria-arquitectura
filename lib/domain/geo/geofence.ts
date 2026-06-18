import type { Coordenada } from "../types";
import { distanciaMetros } from "./haversine";

export const RADIO_GEOFENCE_DEFAULT_M = 100;

export type Geofence = {
  centro: Coordenada;
  radioM: number;
};

export function estaEnGeofence(posicion: Coordenada, geofence: Geofence): boolean {
  return distanciaMetros(posicion, geofence.centro) <= geofence.radioM;
}

export function evaluarGeofence(
  posicion: Coordenada,
  origen: Coordenada,
  destino: Coordenada,
  radioM: number = RADIO_GEOFENCE_DEFAULT_M
): "EN_ORIGEN" | "EN_DESTINO" | "FUERA" {
  if (estaEnGeofence(posicion, { centro: origen, radioM })) return "EN_ORIGEN";
  if (estaEnGeofence(posicion, { centro: destino, radioM })) return "EN_DESTINO";
  return "FUERA";
}
