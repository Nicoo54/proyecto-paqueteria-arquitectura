import { CoordenadasFaltantes, TransportistaNoDisponible, VehiculoNoRegistrado } from "../../../domain/errors";
import type { Envio } from "../../../domain/envio/types";
import type { Coordenada, Dni } from "../../../domain/types";
import { esCoordenadaValida } from "../../../domain/types";
import { CAPACIDAD_POR_CATEGORIA_VEHICULO } from "../../../domain/vehiculo/types";
import type { EnvioRepository, TransportistaRepository } from "../../repositories";

export type ExplorarEnviosInput = {
  dni: Dni;
  posicion: Coordenada | null;
  radioKm?: number;
};

export const RADIO_KM_DEFAULT = 5;

export class ExplorarEnviosUseCase {
  constructor(
    private readonly transportistas: TransportistaRepository,
    private readonly envios: EnvioRepository
  ) {}

  async ejecutar(input: ExplorarEnviosInput): Promise<Envio[]> {
    if (input.posicion === null || !esCoordenadaValida(input.posicion)) {
      throw new CoordenadasFaltantes();
    }

    const transportista = await this.transportistas.obtenerPorDni(input.dni);
    if (transportista === null) {
      throw new Error("Transportista no existe");
    }
    if (transportista.vehiculo === null) {
      throw new VehiculoNoRegistrado();
    }
    if (transportista.estado !== "DISPONIBLE") {
      throw new TransportistaNoDisponible();
    }

    const categoriasAdmitidas = CAPACIDAD_POR_CATEGORIA_VEHICULO[transportista.vehiculo.categoria];

    return this.envios.explorarDisponibles({
      posicion: input.posicion,
      radioKm: input.radioKm ?? RADIO_KM_DEFAULT,
      categoriasAdmitidas,
    });
  }
}
