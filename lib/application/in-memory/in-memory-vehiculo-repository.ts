import type { Dni } from "../../domain/types";
import type { Vehiculo, VehiculoInput } from "../../domain/vehiculo/types";
import type { VehiculoRepository } from "../repositories";

export class InMemoryVehiculoRepository implements VehiculoRepository {
  private readonly porDni = new Map<Dni, Vehiculo>();
  private siguienteId = 1;

  cargar(dni: Dni, vehiculo: Vehiculo): void {
    this.porDni.set(dni, vehiculo);
    if (vehiculo.id >= this.siguienteId) this.siguienteId = vehiculo.id + 1;
  }

  async obtenerPorTransportista(dni: Dni): Promise<Vehiculo | null> {
    return this.porDni.get(dni) ?? null;
  }

  async crearParaTransportista(dni: Dni, input: VehiculoInput): Promise<Vehiculo> {
    const vehiculo: Vehiculo = {
      id: this.siguienteId++,
      categoria: input.categoria,
      patente: input.patente,
      updatedAt: new Date().toISOString(),
    };
    this.porDni.set(dni, vehiculo);
    return vehiculo;
  }

  async actualizarPorTransportista(dni: Dni, input: VehiculoInput): Promise<Vehiculo> {
    const existente = this.porDni.get(dni);
    if (!existente) throw new Error("Vehiculo no existe para actualizar");
    const actualizado: Vehiculo = {
      ...existente,
      categoria: input.categoria,
      patente: input.patente,
      updatedAt: new Date().toISOString(),
    };
    this.porDni.set(dni, actualizado);
    return actualizado;
  }

  async patenteEnUso(patente: string, exceptoTransportistaDni?: Dni): Promise<boolean> {
    for (const [dni, v] of this.porDni.entries()) {
      if (v.patente === patente && dni !== exceptoTransportistaDni) return true;
    }
    return false;
  }
}
