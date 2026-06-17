import type { CategoriaPaqueteEnum, PrismaClient } from "@prisma/client";
import type { Envio } from "../../domain/envio/types";
import type { Dni, EnvioId } from "../../domain/types";
import { distanciaKilometros } from "../../domain/geo/haversine";
import type {
  EnvioRepository,
  FiltroExplorarEnvios,
  PaginacionParams,
  PaginacionResultado,
} from "../../application/repositories/envio-repository";
import { envioPrismaADominio } from "./mappers";

type Tx = Pick<PrismaClient, "envio">;

const GRADO_LAT_KM = 111;

export class PrismaEnvioRepository implements EnvioRepository {
  constructor(private readonly db: Tx) {}

  async obtenerPorId(id: EnvioId): Promise<Envio | null> {
    const e = await this.db.envio.findUnique({ where: { id } });
    return e ? envioPrismaADominio(e) : null;
  }

  async guardar(envio: Envio): Promise<Envio> {
    const guardado = await this.db.envio.update({
      where: { id: envio.id },
      data: {
        transportistaDni: envio.transportistaDni,
        estado: envio.estado,
        zonaCalienteId: envio.zonaCalienteId,
      },
    });
    return envioPrismaADominio(guardado);
  }

  async explorarDisponibles(filtro: FiltroExplorarEnvios): Promise<Envio[]> {
    const deltaLat = filtro.radioKm / GRADO_LAT_KM;
    const cosLat = Math.cos((filtro.posicion.lat * Math.PI) / 180);
    const deltaLng = filtro.radioKm / (GRADO_LAT_KM * Math.max(0.0001, cosLat));

    const candidatos = await this.db.envio.findMany({
      where: {
        estado: "BUSCANDO",
        categoriaPaquete: { in: filtro.categoriasAdmitidas as readonly CategoriaPaqueteEnum[] as CategoriaPaqueteEnum[] },
        origenLat: { gte: filtro.posicion.lat - deltaLat, lte: filtro.posicion.lat + deltaLat },
        origenLng: { gte: filtro.posicion.lng - deltaLng, lte: filtro.posicion.lng + deltaLng },
      },
      take: 100,
    });

    return candidatos
      .map(envioPrismaADominio)
      .filter((e) =>
        distanciaKilometros(filtro.posicion, { lat: e.origen.lat, lng: e.origen.lng }) <= filtro.radioKm
      );
  }

  async obtenerEnTransitoDelTransportista(dni: Dni): Promise<Envio | null> {
    const e = await this.db.envio.findFirst({
      where: {
        transportistaDni: dni,
        estado: { in: ["ACEPTADO", "RETIRADO", "EN_CAMINO"] },
      },
    });
    return e ? envioPrismaADominio(e) : null;
  }

  async historialDelTransportista(
    dni: Dni,
    params: PaginacionParams
  ): Promise<PaginacionResultado<Envio>> {
    const [total, registros] = await Promise.all([
      this.db.envio.count({ where: { transportistaDni: dni } }),
      this.db.envio.findMany({
        where: { transportistaDni: dni },
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
    ]);

    return {
      items: registros.map(envioPrismaADominio),
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / params.limit)),
      },
    };
  }
}
