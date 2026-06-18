import type { PrismaClient } from "@prisma/client";
import type { Coordenada, Dni } from "../../domain/types";
import type {
  EstadoTransportista,
  Transportista,
} from "../../domain/transportista/types";
import type {
  ActualizacionUbicacion,
  TransportistaRepository,
} from "../../application/repositories/transportista-repository";
import { transportistaPrismaADominio } from "./mappers";

type Tx = Pick<PrismaClient, "transportista">;

export class PrismaTransportistaRepository implements TransportistaRepository {
  constructor(private readonly db: Tx) {}

  async obtenerPorDni(dni: Dni): Promise<Transportista | null> {
    const t = await this.db.transportista.findUnique({
      where: { dni },
      include: { vehiculo: true },
    });
    return t ? transportistaPrismaADominio(t) : null;
  }

  async guardar(transportista: Transportista): Promise<Transportista> {
    const guardado = await this.db.transportista.update({
      where: { dni: transportista.dni },
      data: {
        aliasBancario: transportista.aliasBancario,
        cantidadResenas: transportista.cantidadResenas,
        promedioCalificacion: transportista.promedioCalificacion,
        estado: transportista.estado,
      },
      include: { vehiculo: true },
    });
    return transportistaPrismaADominio(guardado);
  }

  async actualizarEstado(dni: Dni, estado: EstadoTransportista): Promise<void> {
    await this.db.transportista.update({
      where: { dni },
      data: { estado },
    });
  }

  async actualizarUbicacion(dni: Dni, ubicacion: ActualizacionUbicacion): Promise<void> {
    await this.db.transportista.update({
      where: { dni },
      data: {
        ultimaLat: ubicacion.lat,
        ultimaLng: ubicacion.lng,
        ultimaActualizacion: ubicacion.timestamp,
      },
    });
  }

  async obtenerUltimaUbicacion(
    dni: Dni
  ): Promise<(Coordenada & { timestamp: Date }) | null> {
    const t = await this.db.transportista.findUnique({
      where: { dni },
      select: { ultimaLat: true, ultimaLng: true, ultimaActualizacion: true },
    });
    if (!t || !t.ultimaLat || !t.ultimaLng || !t.ultimaActualizacion) return null;
    return {
      lat: Number(t.ultimaLat),
      lng: Number(t.ultimaLng),
      timestamp: t.ultimaActualizacion,
    };
  }
}
