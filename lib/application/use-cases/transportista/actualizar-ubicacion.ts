import { CoordenadasInvalidas, TransportistaNoDisponible } from "../../../domain/errors";
import { evaluarGeofence, RADIO_GEOFENCE_DEFAULT_M } from "../../../domain/geo/geofence";
import type { Coordenada, Dni } from "../../../domain/types";
import { esCoordenadaValida } from "../../../domain/types";
import type {
  EnvioRepository,
  TransportistaRepository,
} from "../../repositories";

export type ActualizarUbicacionInput = {
  dni: Dni;
  posicion: Coordenada;
};

export type EventoGeofence = "EN_ORIGEN" | "EN_DESTINO";

export type ActualizarUbicacionOutput = {
  eventoGeofence: EventoGeofence | null;
  codigoEnvio: number | null;
};

export class ActualizarUbicacionUseCase {
  constructor(
    private readonly transportistas: TransportistaRepository,
    private readonly envios: EnvioRepository,
    private readonly radioGeofenceM: number = RADIO_GEOFENCE_DEFAULT_M
  ) {}

  async ejecutar(input: ActualizarUbicacionInput): Promise<ActualizarUbicacionOutput> {
    if (!esCoordenadaValida(input.posicion)) {
      throw new CoordenadasInvalidas(input.posicion.lat, input.posicion.lng);
    }

    const transportista = await this.transportistas.obtenerPorDni(input.dni);
    if (transportista === null) {
      throw new Error("Transportista no existe");
    }

    if (transportista.estado === "NO_DISPONIBLE") {
      throw new TransportistaNoDisponible();
    }

    await this.transportistas.actualizarUbicacion(input.dni, {
      lat: input.posicion.lat,
      lng: input.posicion.lng,
      timestamp: new Date(),
    });

    const envioActivo = await this.envios.obtenerEnTransitoDelTransportista(input.dni);
    if (envioActivo === null) {
      return { eventoGeofence: null, codigoEnvio: null };
    }

    const evento = evaluarGeofence(
      input.posicion,
      { lat: envioActivo.origen.lat, lng: envioActivo.origen.lng },
      { lat: envioActivo.destino.lat, lng: envioActivo.destino.lng },
      this.radioGeofenceM
    );

    return {
      eventoGeofence: evento === "FUERA" ? null : evento,
      codigoEnvio: envioActivo.id,
    };
  }
}
