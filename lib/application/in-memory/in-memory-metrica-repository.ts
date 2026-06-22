import type {
  MetricaDiaria,
  MetricaRepository,
} from "../repositories/metrica-repository";

export class InMemoryMetricaRepository implements MetricaRepository {
  private readonly porFecha = new Map<string, MetricaDiaria>();

  todas(): MetricaDiaria[] {
    return Array.from(this.porFecha.values());
  }

  async upsert(metrica: MetricaDiaria): Promise<MetricaDiaria> {
    const key = metrica.fechaReporte.toISOString().slice(0, 10);
    this.porFecha.set(key, metrica);
    return metrica;
  }
}
