import { PatenteInvalida, VehiculoNoRegistrado } from "../../../domain/errors";
import type { Dni } from "../../../domain/types";
import type { Vehiculo, VehiculoInput } from "../../../domain/vehiculo/types";
import { normalizarPatente, validarPatente } from "../../../domain/vehiculo/validations";
import type { VehiculoRepository } from "../../repositories";

export type ActualizarVehiculoInput = {
  dni: Dni;
  vehiculo: VehiculoInput;
};

export class ActualizarVehiculoUseCase {
  constructor(private readonly vehiculos: VehiculoRepository) {}

  async ejecutar(input: ActualizarVehiculoInput): Promise<Vehiculo> {
    const existente = await this.vehiculos.obtenerPorTransportista(input.dni);
    if (existente === null) {
      throw new VehiculoNoRegistrado();
    }

    const patenteNormalizada = normalizarPatente(input.vehiculo.patente);
    const datos: VehiculoInput = {
      categoria: input.vehiculo.categoria,
      patente: patenteNormalizada,
    };

    validarPatente(datos);

    if (patenteNormalizada !== null) {
      const enUso = await this.vehiculos.patenteEnUso(patenteNormalizada, input.dni);
      if (enUso) {
        throw new PatenteInvalida(patenteNormalizada, "Patente ya está en uso por otro vehículo");
      }
    }

    return this.vehiculos.actualizarPorTransportista(input.dni, datos);
  }
}
