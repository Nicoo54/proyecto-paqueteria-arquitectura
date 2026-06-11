import type { Dni, EnvioId } from "../types";

export const ESTADOS_PAGO = ["RETENIDO", "LIBERADO", "LIQUIDADO", "REVISION_MANUAL"] as const;
export type EstadoPago = (typeof ESTADOS_PAGO)[number];

export type Transaccion = {
  idReferenciaExterna: string;
  codigoSeguimiento: EnvioId;
  montoTotal: number;
  estadoPago: EstadoPago;
  fechaLiquidacion?: string;
  montoComisionPlataforma?: number;
  montoTransportista?: number;
  idTransferenciaExterna?: string;
};

export type DesgloseLiquidacion = {
  envioId: EnvioId;
  transportistaDni: Dni;
  aliasBancario: string;
  costoEnvio: number;
  porcentajeComision: number;
  multiplicadorZonaCaliente: number;
  montoComisionPlataforma: number;
  montoTransportista: number;
  idReferenciaExterna: string;
};
