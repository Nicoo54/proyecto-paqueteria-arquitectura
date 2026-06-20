import { PatenteInvalida } from "../errors";
import type { CategoriaVehiculo, VehiculoInput } from "./types";

const PATENTE_REGEX_NUEVA = /^[A-Z]{2}\d{3}[A-Z]{2}$/;
const PATENTE_REGEX_VIEJA = /^[A-Z]{3}\d{3}$/;

export function esPatenteValida(patente: string): boolean {
  const limpia = patente.trim().toUpperCase();
  return PATENTE_REGEX_NUEVA.test(limpia) || PATENTE_REGEX_VIEJA.test(limpia);
}

export function requierePatente(categoria: CategoriaVehiculo): boolean {
  return categoria !== "BICI";
}

export function validarPatente(input: VehiculoInput): void {
  const { categoria, patente } = input;

  if (!requierePatente(categoria)) {
    return;
  }

  if (patente === null || patente === undefined || patente.trim() === "") {
    throw new PatenteInvalida(patente, `Categoría ${categoria} requiere patente`);
  }

  if (!esPatenteValida(patente)) {
    throw new PatenteInvalida(patente, "Formato de patente inválido");
  }
}

export function normalizarPatente(patente: string | null): string | null {
  if (patente === null) return null;
  const limpia = patente.trim().toUpperCase();
  return limpia === "" ? null : limpia;
}
