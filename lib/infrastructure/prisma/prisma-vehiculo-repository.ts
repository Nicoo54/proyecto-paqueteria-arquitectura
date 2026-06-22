import type { PrismaClient } from "@prisma/client";
import type { Dni } from "../../domain/types";
import type { Vehiculo, VehiculoInput } from "../../domain/vehiculo/types";
import type { VehiculoRepository } from "../../application/repositories/vehiculo-repository";
import { vehiculoPrismaADominio } from "./mappers";

type Tx = Pick<PrismaClient, "vehiculo">;

export class PrismaVehiculoRepository implements VehiculoRepository {
  constructor(private readonly db: Tx) {}

  async obtenerPorTransportista(dni: Dni): Promise<Vehiculo | null> {
    const v = await this.db.vehiculo.findUnique({
      where: { transportistaDni: dni },
    });
    return v ? vehiculoPrismaADominio(v) : null;
  }

  async crearParaTransportista(dni: Dni, input: VehiculoInput): Promise<Vehiculo> {
    const creado = await this.db.vehiculo.create({
      data: {
        transportistaDni: dni,
        categoriaId: input.categoria,
        patente: input.patente,
      },
    });
    return vehiculoPrismaADominio(creado);
  }

  async actualizarPorTransportista(dni: Dni, input: VehiculoInput): Promise<Vehiculo> {
    const actualizado = await this.db.vehiculo.update({
      where: { transportistaDni: dni },
      data: {
        categoriaId: input.categoria,
        patente: input.patente,
      },
    });
    return vehiculoPrismaADominio(actualizado);
  }

  async patenteEnUso(patente: string, exceptoTransportistaDni?: Dni): Promise<boolean> {
    const found = await this.db.vehiculo.findFirst({
      where: {
        patente,
        ...(exceptoTransportistaDni ? { NOT: { transportistaDni: exceptoTransportistaDni } } : {}),
      },
      select: { id: true },
    });
    return found !== null;
  }
}
