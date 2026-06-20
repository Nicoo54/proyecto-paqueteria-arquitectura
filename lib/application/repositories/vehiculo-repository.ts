import type { Dni } from "../../domain/types";
import type { Vehiculo, VehiculoInput } from "../../domain/vehiculo/types";

export interface VehiculoRepository {
  obtenerPorTransportista(dni: Dni): Promise<Vehiculo | null>;

  crearParaTransportista(dni: Dni, input: VehiculoInput): Promise<Vehiculo>;

  actualizarPorTransportista(dni: Dni, input: VehiculoInput): Promise<Vehiculo>;

  patenteEnUso(patente: string, exceptoTransportistaDni?: Dni): Promise<boolean>;
}
