export type MetricaDiaria = {
  fechaReporte: Date;
  cantidadEnviosTotales: number;
  gananciaNetaPlataforma: number;
};

export interface MetricaRepository {
  upsert(metrica: MetricaDiaria): Promise<MetricaDiaria>;
}
