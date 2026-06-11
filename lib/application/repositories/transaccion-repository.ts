import type { EnvioId } from "../../domain/types";
import type { Transaccion } from "../../domain/liquidacion/types";

export interface TransaccionRepository {
  obtenerPorEnvio(envioId: EnvioId): Promise<Transaccion | null>;

  guardar(transaccion: Transaccion): Promise<Transaccion>;

  listarLiquidables(): Promise<Transaccion[]>;
}
