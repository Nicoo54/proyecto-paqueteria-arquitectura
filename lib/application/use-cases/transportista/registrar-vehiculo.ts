import { PatenteInvalida, VehiculoYaRegistrado } from "../../../domain/errors";
import type { Dni } from "../../../domain/types";
import type { Vehiculo, VehiculoInput } from "../../../domain/vehiculo/types";
import { normalizarPatente, validarPatente } from "../../../domain/vehiculo/validations";
import type { VehiculoRepository } from "../../repositories";

export type RegistrarVehiculoInput = {
  dni: Dni;
  vehiculo: VehiculoInput;
};

export class RegistrarVehiculoUseCase {
  constructor(private readonly vehiculos: VehiculoRepository) {}

  async ejecutar(input: RegistrarVehiculoInput): Promise<Vehiculo> {
    const patenteNormalizada = normalizarPatente(input.vehiculo.patente);
    const datos: VehiculoInput = {
      categoria: input.vehiculo.categoria,
      patente: patenteNormalizada,
    };

    validarPatente(datos);

    const yaTiene = await this.vehiculos.obtenerPorTransportista(input.dni);
    if (yaTiene !== null) {
      throw new VehiculoYaRegistrado();
    }

    if (patenteNormalizada !== null) {
      const enUso = await this.vehiculos.patenteEnUso(patenteNormalizada);
      if (enUso) {
        throw new PatenteInvalida(patenteNormalizada, "Patente ya está en uso");
      }
    }

    return this.vehiculos.crearParaTransportista(input.dni, datos);
  }
}
