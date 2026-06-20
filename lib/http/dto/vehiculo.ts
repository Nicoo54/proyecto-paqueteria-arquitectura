import type { CategoriaVehiculo, Vehiculo, VehiculoInput } from "../../domain/vehiculo/types";

export type VehiculoDto = {
  id: number;
  categoria: CategoriaVehiculo;
  patente: string | null;
  updatedAt?: string;
};

export function vehiculoADto(v: Vehiculo): VehiculoDto {
  return {
    id: v.id,
    categoria: v.categoria,
    patente: v.patente,
    updatedAt: v.updatedAt,
  };
}

export type VehiculoRequestDto = {
  categoria: CategoriaVehiculo;
  patente: string | null;
};

export function vehiculoRequestADominio(dto: VehiculoRequestDto): VehiculoInput {
  return { categoria: dto.categoria, patente: dto.patente };
}
