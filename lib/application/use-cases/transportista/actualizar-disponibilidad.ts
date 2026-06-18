import type { Dni } from "../../../domain/types";
import { ponerseDisponible, ponerseNoDisponible } from "../../../domain/transportista/state-machine";
import type { EstadoTransportista } from "../../../domain/transportista/types";
import type { TransportistaRepository } from "../../repositories";

export type ActualizarDisponibilidadInput = {
  dni: Dni;
  disponible: boolean;
};

export type ActualizarDisponibilidadOutput = {
  estado: EstadoTransportista;
};

export class ActualizarDisponibilidadUseCase {
  constructor(private readonly transportistas: TransportistaRepository) {}

  async ejecutar(input: ActualizarDisponibilidadInput): Promise<ActualizarDisponibilidadOutput> {
    const transportista = await this.transportistas.obtenerPorDni(input.dni);
    if (transportista === null) {
      throw new Error("Transportista no existe");
    }

    const actualizado = input.disponible
      ? ponerseDisponible(transportista)
      : ponerseNoDisponible(transportista);

    await this.transportistas.actualizarEstado(input.dni, actualizado.estado);
    return { estado: actualizado.estado };
  }
}
