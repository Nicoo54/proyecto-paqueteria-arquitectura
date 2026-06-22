import type { PrismaClient } from "@prisma/client";
import type {
  MetricaDiaria,
  MetricaRepository,
} from "../../application/repositories/metrica-repository";

type Tx = Pick<PrismaClient, "metrica">;

export class PrismaMetricaRepository implements MetricaRepository {
  constructor(private readonly db: Tx) {}

  async upsert(metrica: MetricaDiaria): Promise<MetricaDiaria> {
    const r = await this.db.metrica.upsert({
      where: { fechaReporte: metrica.fechaReporte },
      update: {
        cantidadEnviosTotales: metrica.cantidadEnviosTotales,
        gananciaNetaPlataforma: metrica.gananciaNetaPlataforma,
      },
      create: {
        fechaReporte: metrica.fechaReporte,
        cantidadEnviosTotales: metrica.cantidadEnviosTotales,
        gananciaNetaPlataforma: metrica.gananciaNetaPlataforma,
      },
    });
    return {
      fechaReporte: r.fechaReporte,
      cantidadEnviosTotales: r.cantidadEnviosTotales,
      gananciaNetaPlataforma: Number(r.gananciaNetaPlataforma),
    };
  }
}
