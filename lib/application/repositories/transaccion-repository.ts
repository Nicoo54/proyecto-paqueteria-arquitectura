import type { Dni, EnvioId } from "../../domain/types";
import type { Transaccion } from "../../domain/liquidacion/types";

export type TransaccionLiquidable = {
  transaccion: Transaccion;
  envio: {
    id: EnvioId;
    costo: number;
    zonaCalienteMultiplicador: number | null;
  };
  transportista: {
    dni: Dni;
    aliasBancario: string;
  };
};

export interface TransaccionRepository {
  obtenerPorEnvio(envioId: EnvioId): Promise<Transaccion | null>;

  guardar(transaccion: Transaccion): Promise<Transaccion>;

  listarLiquidables(): Promise<Transaccion[]>;

  listarLiquidablesConDetalles(): Promise<TransaccionLiquidable[]>;
}
