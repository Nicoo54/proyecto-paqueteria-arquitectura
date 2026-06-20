export type Dni = string;
export type EnvioId = number;
export type VehiculoId = number;
export type Iso8601 = string;

export type Coordenada = {
  lat: number;
  lng: number;
};

export type Resultado<T, E = string> =
  | { ok: true; valor: T }
  | { ok: false; errores: E[] };

export function ok<T>(valor: T): Resultado<T> {
  return { ok: true, valor };
}

export function fail<E = string>(...errores: E[]): Resultado<never, E> {
  return { ok: false, errores };
}

export function esCoordenadaValida(c: Coordenada): boolean {
  return (
    Number.isFinite(c.lat) &&
    Number.isFinite(c.lng) &&
    c.lat >= -90 &&
    c.lat <= 90 &&
    c.lng >= -180 &&
    c.lng <= 180
  );
}
