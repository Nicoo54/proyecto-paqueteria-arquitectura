import type { Envio, EstadoEnvio } from "../../domain/envio/types";
import type { CategoriaPaquete } from "../../domain/vehiculo/types";

export type EnvioDto = {
  id: number;
  categoriaPaquete: CategoriaPaquete;
  remitenteDni: string;
  transportistaDni: string | null;
  zonaCalienteId: number | null;
  origenDireccion: string;
  origenLat: number;
  origenLng: number;
  destinoDireccion: string;
  destinoLat: number;
  destinoLng: number;
  condicionClimatica: string;
  estado: EstadoEnvio;
  costo: number;
  createdAt?: string;
  updatedAt?: string;
};

export function envioADto(e: Envio): EnvioDto {
  return {
    id: e.id,
    categoriaPaquete: e.categoriaPaquete,
    remitenteDni: e.remitenteDni,
    transportistaDni: e.transportistaDni,
    zonaCalienteId: e.zonaCalienteId,
    origenDireccion: e.origen.direccion,
    origenLat: e.origen.lat,
    origenLng: e.origen.lng,
    destinoDireccion: e.destino.direccion,
    destinoLat: e.destino.lat,
    destinoLng: e.destino.lng,
    condicionClimatica: String(e.condicionClimatica),
    estado: e.estado,
    costo: e.costo,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

export type AceptarEnvioRequestDto = {
  estado: "ACEPTADO";
};

export type CambiarEstadoEnvioRequestDto = {
  estado: "RETIRADO" | "EN_CAMINO" | "ENTREGADO";
};

export type ExplorarEnviosQueryDto = {
  lat: number;
  lng: number;
  radioKm?: number;
};
