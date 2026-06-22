import type { VehiculoId } from "../types";

export const CATEGORIAS_VEHICULO = ["BICI", "MOTO", "AUTO"] as const;
export type CategoriaVehiculo = (typeof CATEGORIAS_VEHICULO)[number];

export const CATEGORIAS_PAQUETE = ["S", "M", "L"] as const;
export type CategoriaPaquete = (typeof CATEGORIAS_PAQUETE)[number];

export type Vehiculo = {
  id: VehiculoId;
  categoria: CategoriaVehiculo;
  patente: string | null;
  updatedAt?: string;
};

export type VehiculoInput = {
  categoria: CategoriaVehiculo;
  patente: string | null;
};

export const CAPACIDAD_POR_CATEGORIA_VEHICULO: Record<CategoriaVehiculo, CategoriaPaquete[]> = {
  BICI: ["S"],
  MOTO: ["S", "M"],
  AUTO: ["S", "M", "L"],
};

export function admiteCategoriaPaquete(
  vehiculo: CategoriaVehiculo,
  paquete: CategoriaPaquete
): boolean {
  return CAPACIDAD_POR_CATEGORIA_VEHICULO[vehiculo].includes(paquete);
}
