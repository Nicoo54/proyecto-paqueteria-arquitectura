import type { Dni } from "../types";
import type { DesgloseLiquidacion } from "./types";

export const PORCENTAJE_COMISION_DEFAULT = 0.15;

export type EntradaCalculoLiquidacion = {
  envioId: number;
  transportistaDni: Dni;
  aliasBancario: string;
  costoEnvio: number;
  multiplicadorZonaCaliente?: number;
  porcentajeComision?: number;
  idReferenciaExterna: string;
};

function redondearDosDecimales(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calcularDesgloseLiquidacion(
  entrada: EntradaCalculoLiquidacion
): DesgloseLiquidacion {
  const porcentajeComision = entrada.porcentajeComision ?? PORCENTAJE_COMISION_DEFAULT;
  const multiplicadorZonaCaliente = entrada.multiplicadorZonaCaliente ?? 1;

  if (porcentajeComision < 0 || porcentajeComision > 1) {
    throw new RangeError("porcentajeComision debe estar entre 0 y 1");
  }
  if (multiplicadorZonaCaliente < 1) {
    throw new RangeError("multiplicadorZonaCaliente no puede ser menor a 1");
  }
  if (entrada.costoEnvio < 0) {
    throw new RangeError("costoEnvio no puede ser negativo");
  }

  const comisionBase = entrada.costoEnvio * porcentajeComision;
  const montoComisionPlataforma = redondearDosDecimales(comisionBase / multiplicadorZonaCaliente);
  const montoTransportista = redondearDosDecimales(entrada.costoEnvio - montoComisionPlataforma);

  return {
    envioId: entrada.envioId,
    transportistaDni: entrada.transportistaDni,
    aliasBancario: entrada.aliasBancario,
    costoEnvio: entrada.costoEnvio,
    porcentajeComision,
    multiplicadorZonaCaliente,
    montoComisionPlataforma,
    montoTransportista,
    idReferenciaExterna: entrada.idReferenciaExterna,
  };
}
