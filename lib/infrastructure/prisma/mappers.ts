import type { Prisma } from "@prisma/client";
import type { Envio } from "../../domain/envio/types";
import type { Transaccion } from "../../domain/liquidacion/types";
import type { Transportista } from "../../domain/transportista/types";
import type { Vehiculo } from "../../domain/vehiculo/types";

type Decimalish = Prisma.Decimal | number | string | null;

function decimalANumber(v: Decimalish): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v);
  return v.toNumber();
}

function decimalANullable(v: Decimalish): number | null {
  if (v === null || v === undefined) return null;
  return decimalANumber(v);
}

export type VehiculoPrisma = {
  id: number;
  categoriaId: string;
  patente: string | null;
  updatedAt: Date;
};

export type TransportistaPrisma = {
  dni: string;
  aliasBancario: string;
  cantidadResenas: number;
  promedioCalificacion: Prisma.Decimal;
  estado: string;
  vehiculo?: VehiculoPrisma | null;
};

export type EnvioPrisma = {
  id: number;
  categoriaPaquete: string;
  remitenteDni: string;
  transportistaDni: string | null;
  zonaCalienteId: number | null;
  origenDireccion: string;
  origenLat: Prisma.Decimal;
  origenLng: Prisma.Decimal;
  destinoDireccion: string;
  destinoLat: Prisma.Decimal;
  destinoLng: Prisma.Decimal;
  condicionClimatica: string;
  estado: string;
  costo: Prisma.Decimal;
  createdAt: Date;
  updatedAt: Date;
};

export type TransaccionPrisma = {
  idReferenciaExterna: string;
  envioId: number;
  montoTotal: Prisma.Decimal;
  estadoPago: string;
  fechaLiquidacion: Date | null;
  montoComisionPlataforma: Prisma.Decimal | null;
  montoTransportista: Prisma.Decimal | null;
  idTransferenciaExterna: string | null;
};

export function vehiculoPrismaADominio(v: VehiculoPrisma): Vehiculo {
  return {
    id: v.id,
    categoria: v.categoriaId as Vehiculo["categoria"],
    patente: v.patente,
    updatedAt: v.updatedAt.toISOString(),
  };
}

export function transportistaPrismaADominio(t: TransportistaPrisma): Transportista {
  return {
    dni: t.dni,
    aliasBancario: t.aliasBancario,
    cantidadResenas: t.cantidadResenas,
    promedioCalificacion: decimalANumber(t.promedioCalificacion),
    estado: t.estado as Transportista["estado"],
    vehiculo: t.vehiculo ? vehiculoPrismaADominio(t.vehiculo) : null,
  };
}

export function envioPrismaADominio(e: EnvioPrisma): Envio {
  return {
    id: e.id,
    categoriaPaquete: e.categoriaPaquete as Envio["categoriaPaquete"],
    remitenteDni: e.remitenteDni,
    transportistaDni: e.transportistaDni,
    zonaCalienteId: e.zonaCalienteId,
    origen: {
      lat: decimalANumber(e.origenLat),
      lng: decimalANumber(e.origenLng),
      direccion: e.origenDireccion,
    },
    destino: {
      lat: decimalANumber(e.destinoLat),
      lng: decimalANumber(e.destinoLng),
      direccion: e.destinoDireccion,
    },
    condicionClimatica: e.condicionClimatica,
    estado: e.estado as Envio["estado"],
    costo: decimalANumber(e.costo),
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  };
}

export function transaccionPrismaADominio(t: TransaccionPrisma): Transaccion {
  return {
    idReferenciaExterna: t.idReferenciaExterna,
    codigoSeguimiento: t.envioId,
    montoTotal: decimalANumber(t.montoTotal),
    estadoPago: t.estadoPago as Transaccion["estadoPago"],
    fechaLiquidacion: t.fechaLiquidacion?.toISOString(),
    montoComisionPlataforma: decimalANullable(t.montoComisionPlataforma) ?? undefined,
    montoTransportista: decimalANullable(t.montoTransportista) ?? undefined,
    idTransferenciaExterna: t.idTransferenciaExterna ?? undefined,
  };
}
