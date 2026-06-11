import type { Dni, EnvioId } from "../../../domain/types";
import { aceptarEnvio as aceptarEnvioDominio } from "../../../domain/transportista/aceptar-envio";
import type {
  EnvioRepository,
  TransportistaRepository,
  UnitOfWork,
} from "../../repositories";

export type AceptarEnvioInput = {
  transportistaDni: Dni;
  envioId: EnvioId;
  posicionTransportista: { lat: number; lng: number } | null;
};

export type AceptarEnvioOutput = {
  envioId: EnvioId;
  estado: string;
};

export class AceptarEnvioUseCase {
  constructor(
    private readonly transportistas: TransportistaRepository,
    private readonly envios: EnvioRepository,
    private readonly uow: UnitOfWork
  ) {}

  async ejecutar(input: AceptarEnvioInput): Promise<AceptarEnvioOutput> {
    return this.uow.ejecutar(async () => {
      const transportista = await this.transportistas.obtenerPorDni(input.transportistaDni);
      if (transportista === null) {
        throw new Error("Transportista no existe");
      }

      const envio = await this.envios.obtenerPorId(input.envioId);
      if (envio === null) {
        throw new Error("Envío no existe");
      }

      const envioEnTransito = await this.envios.obtenerEnTransitoDelTransportista(
        input.transportistaDni
      );

      const { transportistaActualizado, envioActualizado } = aceptarEnvioDominio({
        transportista,
        envio,
        posicionTransportista: input.posicionTransportista,
        envioEnTransitoActual: envioEnTransito,
      });

      await this.transportistas.guardar(transportistaActualizado);
      await this.envios.guardar(envioActualizado);

      return { envioId: envioActualizado.id, estado: envioActualizado.estado };
    });
  }
}
