import type { Transaccion } from "../../domain/liquidacion/types";
import type { EnvioId } from "../../domain/types";
import type {
  TransaccionLiquidable,
  TransaccionRepository,
} from "../repositories";

export class InMemoryTransaccionRepository implements TransaccionRepository {
  private readonly porRef = new Map<string, Transaccion>();
  private readonly porEnvio = new Map<EnvioId, Transaccion>();
  private liquidablesConDetalles: TransaccionLiquidable[] = [];

  cargar(tx: Transaccion): void {
    this.porRef.set(tx.idReferenciaExterna, tx);
    this.porEnvio.set(tx.codigoSeguimiento, tx);
  }

  cargarLiquidablesConDetalles(items: TransaccionLiquidable[]): void {
    this.liquidablesConDetalles = items;
    for (const it of items) this.cargar(it.transaccion);
  }

  todas(): Transaccion[] {
    return Array.from(this.porRef.values());
  }

  obtenerSync(idRef: string): Transaccion | null {
    return this.porRef.get(idRef) ?? null;
  }

  async obtenerPorEnvio(envioId: EnvioId): Promise<Transaccion | null> {
    return this.porEnvio.get(envioId) ?? null;
  }

  async guardar(transaccion: Transaccion): Promise<Transaccion> {
    this.porRef.set(transaccion.idReferenciaExterna, transaccion);
    this.porEnvio.set(transaccion.codigoSeguimiento, transaccion);
    return transaccion;
  }

  async listarLiquidables(): Promise<Transaccion[]> {
    return Array.from(this.porRef.values()).filter((t) => t.estadoPago === "RETENIDO");
  }

  async listarLiquidablesConDetalles(): Promise<TransaccionLiquidable[]> {
    return this.liquidablesConDetalles.map((it) => {
      const actual = this.porRef.get(it.transaccion.idReferenciaExterna) ?? it.transaccion;
      return { ...it, transaccion: actual };
    });
  }
}
