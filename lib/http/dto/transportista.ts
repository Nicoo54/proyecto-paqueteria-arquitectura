import type { Transportista } from "../../domain/transportista/types";
import { vehiculoADto, type VehiculoDto } from "./vehiculo";

export type TransportistaDto = {
  dni: string;
  aliasBancario: string;
  cantidadResenas: number;
  promedioCalificacion: number;
  estado: string;
  vehiculo: VehiculoDto | null;
};

export function transportistaADto(t: Transportista): TransportistaDto {
  return {
    dni: t.dni,
    aliasBancario: t.aliasBancario,
    cantidadResenas: t.cantidadResenas,
    promedioCalificacion: t.promedioCalificacion,
    estado: t.estado,
    vehiculo: t.vehiculo ? vehiculoADto(t.vehiculo) : null,
  };
}

export type ActualizarDisponibilidadRequestDto = {
  disponible: boolean;
};

export type ActualizarUbicacionRequestDto = {
  lat: number;
  lng: number;
};
