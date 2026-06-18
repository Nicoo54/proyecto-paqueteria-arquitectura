import type { Envio } from "../envio/types";
import type { Transportista } from "../transportista/types";
import type { Vehiculo } from "../vehiculo/types";

export const vehiculoMoto: Vehiculo = {
  id: 1,
  categoria: "MOTO",
  patente: "AB123CD",
};

export const vehiculoAuto: Vehiculo = {
  id: 2,
  categoria: "AUTO",
  patente: "AC456DE",
};

export const vehiculoBici: Vehiculo = {
  id: 3,
  categoria: "BICI",
  patente: null,
};

export const transportistaDisponible: Transportista = {
  dni: "28987654",
  aliasBancario: "mi.alias@banco",
  cantidadResenas: 10,
  promedioCalificacion: 4.5,
  estado: "DISPONIBLE",
  vehiculo: vehiculoMoto,
};

export const transportistaNoDisponible: Transportista = {
  ...transportistaDisponible,
  estado: "NO_DISPONIBLE",
};

export const transportistaOcupado: Transportista = {
  ...transportistaDisponible,
  estado: "OCUPADO",
};

export const transportistaSinVehiculo: Transportista = {
  ...transportistaDisponible,
  vehiculo: null,
};

export const envioBuscando: Envio = {
  id: 1040,
  categoriaPaquete: "M",
  remitenteDni: "35123456",
  transportistaDni: null,
  zonaCalienteId: null,
  origen: { lat: -38.718334, lng: -62.266321, direccion: "Av. Alem 1253, Bahía Blanca" },
  destino: { lat: -38.712451, lng: -62.254124, direccion: "Sarmiento 456, Bahía Blanca" },
  condicionClimatica: "DESPEJADO",
  estado: "BUSCANDO",
  costo: 1850,
};

export const envioGrande: Envio = {
  ...envioBuscando,
  id: 1041,
  categoriaPaquete: "L",
};

export const envioAceptado: Envio = {
  ...envioBuscando,
  id: 1042,
  estado: "ACEPTADO",
  transportistaDni: "28987654",
};

export const posicionEnOrigen = { lat: -38.718334, lng: -62.266321 };
export const posicionEnDestino = { lat: -38.712451, lng: -62.254124 };
export const posicionLejana = { lat: -38.000000, lng: -62.000000 };
