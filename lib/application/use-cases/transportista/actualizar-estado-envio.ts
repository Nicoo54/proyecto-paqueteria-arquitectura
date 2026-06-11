import type { Dni, EnvioId } from "../../../domain/types";
import type { EstadoEnvio } from "../../../domain/envio/types";
import { actualizarEstadoEnvio as actualizarEstadoEnvioDominio } from "../../../domain/transportista/actualizar-estado-envio";
import type {
  EnvioRepository,
  TransportistaRepository,
  UnitOfWork,
} from "../../repositories";

export type ActualizarEstadoEnvioInput = {
  transportistaDni: Dni;
  envioId: EnvioId;
  nuevoEstado: EstadoEnvio;
  posicionTransportista: { lat: number; lng: number } | null;
};

export type ActualizarEstadoEnvioOutput = {
  envioId: EnvioId;
  estado: EstadoEnvio;
};

export class ActualizarEstadoEnvioUseCase {
  constructor(
    private readonly transportistas: TransportistaRepository,
    private readonly envios: EnvioRepository,
    private readonly uow: UnitOfWork
  ) {}

  async ejecutar(input: ActualizarEstadoEnvioInput): Promise<ActualizarEstadoEnvioOutput> {
    return this.uow.ejecutar(async () => {
      const transportista = await this.transportistas.obtenerPorDni(input.transportistaDni);
      if (transportista === null) {
        throw new Error("Transportista no existe");
      }

      const envio = await this.envios.obtenerPorId(input.envioId);
      if (envio === null) {
        throw new Error("Envío no existe");
      }

      const otroEnTransito = await this.envios.obtenerEnTransitoDelTransportista(
        input.transportistaDni
      );

      const otroAjenoAlActual =
        otroEnTransito !== null && otroEnTransito.id !== envio.id ? otroEnTransito : null;

      const { transportistaActualizado, envioActualizado } = actualizarEstadoEnvioDominio({
        transportista,
        envio,
        nuevoEstado: input.nuevoEstado,
        posicionTransportista: input.posicionTransportista,
        otroEnvioEnTransito: otroAjenoAlActual,
      });

      await this.transportistas.guardar(transportistaActualizado);
      await this.envios.guardar(envioActualizado);

      return { envioId: envioActualizado.id, estado: envioActualizado.estado };
    });
  }
}
