import type { PrismaClient } from "@prisma/client";
import type { Transaccion } from "../../domain/liquidacion/types";
import type { EnvioId } from "../../domain/types";
import type {
  TransaccionLiquidable,
  TransaccionRepository,
} from "../../application/repositories/transaccion-repository";
import { transaccionPrismaADominio } from "./mappers";

type Tx = Pick<PrismaClient, "transaccion">;

export class PrismaTransaccionRepository implements TransaccionRepository {
  constructor(private readonly db: Tx) {}

  async obtenerPorEnvio(envioId: EnvioId): Promise<Transaccion | null> {
    const t = await this.db.transaccion.findUnique({ where: { envioId } });
    return t ? transaccionPrismaADominio(t) : null;
  }

  async guardar(transaccion: Transaccion): Promise<Transaccion> {
    const guardada = await this.db.transaccion.update({
      where: { idReferenciaExterna: transaccion.idReferenciaExterna },
      data: {
        estadoPago: transaccion.estadoPago,
        fechaLiquidacion: transaccion.fechaLiquidacion
          ? new Date(transaccion.fechaLiquidacion)
          : null,
        montoComisionPlataforma: transaccion.montoComisionPlataforma ?? null,
        montoTransportista: transaccion.montoTransportista ?? null,
        idTransferenciaExterna: transaccion.idTransferenciaExterna ?? null,
      },
    });
    return transaccionPrismaADominio(guardada);
  }

  async listarLiquidables(): Promise<Transaccion[]> {
    const items = await this.db.transaccion.findMany({
      where: { estadoPago: "RETENIDO", envio: { estado: "ENTREGADO" } },
    });
    return items.map(transaccionPrismaADominio);
  }

  async listarLiquidablesConDetalles(): Promise<TransaccionLiquidable[]> {
    const items = await this.db.transaccion.findMany({
      where: { estadoPago: "RETENIDO", envio: { estado: "ENTREGADO" } },
      include: {
        envio: {
          include: {
            transportista: { select: { dni: true, aliasBancario: true } },
            zonaCaliente: { select: { multiplicadorPrecio: true } },
          },
        },
      },
    });

    return items.flatMap((it): TransaccionLiquidable[] => {
      const t = it.envio.transportista;
      if (!t) return [];
      return [
        {
          transaccion: transaccionPrismaADominio(it),
          envio: {
            id: it.envio.id,
            costo: Number(it.envio.costo),
            zonaCalienteMultiplicador: it.envio.zonaCaliente
              ? Number(it.envio.zonaCaliente.multiplicadorPrecio)
              : null,
          },
          transportista: { dni: t.dni, aliasBancario: t.aliasBancario },
        },
      ];
    });
  }
}
