import type { PrismaClient } from "@prisma/client";
import type {
  ZonaCaliente,
  ZonaCalienteRepository,
} from "../../application/repositories/zona-caliente-repository";

type Tx = Pick<PrismaClient, "zonaCaliente">;

export class PrismaZonaCalienteRepository implements ZonaCalienteRepository {
  constructor(private readonly db: Tx) {}

  async vencerHasta(fecha: Date): Promise<number> {
    const r = await this.db.zonaCaliente.deleteMany({
      where: { fechaVigenciaFin: { lt: fecha } },
    });
    return r.count;
  }

  async insertarVarias(zonas: ZonaCaliente[]): Promise<void> {
    if (zonas.length === 0) return;
    await this.db.zonaCaliente.createMany({
      data: zonas.map((z) => ({
        centroLat: z.centro.lat,
        centroLng: z.centro.lng,
        radioM: z.radioM,
        multiplicadorPrecio: z.multiplicadorPrecio,
        fechaVigenciaInicio: z.fechaVigenciaInicio,
        fechaVigenciaFin: z.fechaVigenciaFin,
      })),
    });
  }
}
