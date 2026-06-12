import type { Transaccion } from "../../domain/liquidacion/types";
import type { TransaccionLiquidable } from "../repositories";

export function txRetenida(idRef: string, envioId: number, monto = 1000): Transaccion {
  return {
    idReferenciaExterna: idRef,
    codigoSeguimiento: envioId,
    montoTotal: monto,
    estadoPago: "RETENIDO",
  };
}

export function liquidable(
  idRef: string,
  envioId: number,
  costo = 1000,
  zonaCalienteMultiplicador: number | null = null,
  dni = "28987654",
  alias = "mi.alias@banco"
): TransaccionLiquidable {
  return {
    transaccion: txRetenida(idRef, envioId, costo),
    envio: { id: envioId, costo, zonaCalienteMultiplicador },
    transportista: { dni, aliasBancario: alias },
  };
}
