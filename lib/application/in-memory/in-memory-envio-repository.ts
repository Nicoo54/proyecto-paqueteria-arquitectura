import type { Envio } from "../../domain/envio/types";
import { distanciaKilometros } from "../../domain/geo/haversine";
import type { Dni, EnvioId } from "../../domain/types";
import type {
  EnvioRepository,
  FiltroExplorarEnvios,
  PaginacionParams,
  PaginacionResultado,
} from "../repositories";

export class InMemoryEnvioRepository implements EnvioRepository {
  private readonly porId = new Map<EnvioId, Envio>();

  cargar(e: Envio): void {
    this.porId.set(e.id, e);
  }

  cargarVarios(es: Envio[]): void {
    for (const e of es) this.cargar(e);
  }

  todos(): Envio[] {
    return Array.from(this.porId.values());
  }

  async obtenerPorId(id: EnvioId): Promise<Envio | null> {
    return this.porId.get(id) ?? null;
  }

  async guardar(envio: Envio): Promise<Envio> {
    this.porId.set(envio.id, envio);
    return envio;
  }

  async explorarDisponibles(filtro: FiltroExplorarEnvios): Promise<Envio[]> {
    return Array.from(this.porId.values()).filter((e) => {
      if (e.estado !== "BUSCANDO") return false;
      if (!filtro.categoriasAdmitidas.includes(e.categoriaPaquete)) return false;
      const distancia = distanciaKilometros(filtro.posicion, {
        lat: e.origen.lat,
        lng: e.origen.lng,
      });
      return distancia <= filtro.radioKm;
    });
  }

  async obtenerEnTransitoDelTransportista(dni: Dni): Promise<Envio | null> {
    for (const e of this.porId.values()) {
      if (
        e.transportistaDni === dni &&
        (e.estado === "ACEPTADO" || e.estado === "RETIRADO" || e.estado === "EN_CAMINO")
      ) {
        return e;
      }
    }
    return null;
  }

  async historialDelTransportista(
    dni: Dni,
    params: PaginacionParams
  ): Promise<PaginacionResultado<Envio>> {
    const filtrados = Array.from(this.porId.values()).filter((e) => e.transportistaDni === dni);
    const total = filtrados.length;
    const totalPages = Math.max(1, Math.ceil(total / params.limit));
    const inicio = (params.page - 1) * params.limit;
    const items = filtrados.slice(inicio, inicio + params.limit);
    return {
      items,
      pagination: { page: params.page, limit: params.limit, total, totalPages },
    };
  }

  async listarEnRango(desde: Date, hasta: Date): Promise<Envio[]> {
    return Array.from(this.porId.values()).filter((e) => {
      if (!e.createdAt) return false;
      const t = new Date(e.createdAt).getTime();
      return t >= desde.getTime() && t < hasta.getTime();
    });
  }
}
