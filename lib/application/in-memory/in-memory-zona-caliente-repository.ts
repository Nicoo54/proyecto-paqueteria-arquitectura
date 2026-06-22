import type {
  ZonaCaliente,
  ZonaCalienteRepository,
} from "../repositories/zona-caliente-repository";

export class InMemoryZonaCalienteRepository implements ZonaCalienteRepository {
  private zonas: ZonaCaliente[] = [];

  cargar(zonas: ZonaCaliente[]): void {
    this.zonas = [...zonas];
  }

  todas(): ZonaCaliente[] {
    return [...this.zonas];
  }

  async vencerHasta(fecha: Date): Promise<number> {
    const antes = this.zonas.length;
    this.zonas = this.zonas.filter((z) => z.fechaVigenciaFin >= fecha);
    return antes - this.zonas.length;
  }

  async insertarVarias(zonas: ZonaCaliente[]): Promise<void> {
    this.zonas.push(...zonas);
  }
}
