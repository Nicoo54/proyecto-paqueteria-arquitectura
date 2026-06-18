import { CoordenadasInvalidas } from "../errors";
import { esCoordenadaValida, type Coordenada } from "../types";

const RADIO_TIERRA_METROS = 6_371_000;

function toRadianes(grados: number): number {
  return (grados * Math.PI) / 180;
}

export function distanciaMetros(a: Coordenada, b: Coordenada): number {
  if (!esCoordenadaValida(a)) throw new CoordenadasInvalidas(a.lat, a.lng);
  if (!esCoordenadaValida(b)) throw new CoordenadasInvalidas(b.lat, b.lng);

  const dLat = toRadianes(b.lat - a.lat);
  const dLng = toRadianes(b.lng - a.lng);
  const lat1 = toRadianes(a.lat);
  const lat2 = toRadianes(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * RADIO_TIERRA_METROS * Math.asin(Math.sqrt(h));
}

export function distanciaKilometros(a: Coordenada, b: Coordenada): number {
  return distanciaMetros(a, b) / 1000;
}
