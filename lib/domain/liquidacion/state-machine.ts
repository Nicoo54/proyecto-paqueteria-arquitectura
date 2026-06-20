import { TransicionInvalida } from "../errors";
import type { EstadoPago, Transaccion } from "./types";

const TRANSICIONES_VALIDAS: Record<EstadoPago, EstadoPago[]> = {
  RETENIDO: ["LIBERADO"],
  LIBERADO: ["LIQUIDADO", "REVISION_MANUAL"],
  LIQUIDADO: [],
  REVISION_MANUAL: ["LIQUIDADO"],
};

export function puedeTransicionarPago(desde: EstadoPago, hasta: EstadoPago): boolean {
  return TRANSICIONES_VALIDAS[desde].includes(hasta);
}

export function transicionarPago(tx: Transaccion, hasta: EstadoPago): Transaccion {
  if (tx.estadoPago === hasta) return tx;
  if (!puedeTransicionarPago(tx.estadoPago, hasta)) {
    throw new TransicionInvalida(tx.estadoPago, hasta);
  }
  return { ...tx, estadoPago: hasta };
}

export function marcarLiberado(tx: Transaccion): Transaccion {
  return transicionarPago(tx, "LIBERADO");
}

export function marcarLiquidado(
  tx: Transaccion,
  datos: {
    fechaLiquidacion: string;
    montoComisionPlataforma: number;
    montoTransportista: number;
    idTransferenciaExterna: string;
  }
): Transaccion {
  return { ...transicionarPago(tx, "LIQUIDADO"), ...datos };
}

export function marcarRevisionManual(tx: Transaccion): Transaccion {
  return transicionarPago(tx, "REVISION_MANUAL");
}
