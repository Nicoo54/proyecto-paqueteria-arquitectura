import {
  CapacidadInsuficiente,
  CoordenadasFaltantes,
  EnvioNoDisponible,
  TransportistaNoDisponible,
  TransportistaOcupado,
  VehiculoNoRegistrado,
} from "../errors";
import type { Envio } from "../envio/types";
import { estaDisponibleParaAceptar } from "../envio/types";
import { transicionarEnvio } from "../envio/state-machine";
import type { Coordenada } from "../types";
import { admiteCategoriaPaquete } from "../vehiculo/types";
import type { Transportista } from "./types";
import { marcarOcupado } from "./state-machine";

export type ContextoAceptacion = {
  transportista: Transportista;
  envio: Envio;
  posicionTransportista: Coordenada | null;
  envioEnTransitoActual: Envio | null;
};

export type ResultadoAceptacion = {
  transportistaActualizado: Transportista;
  envioActualizado: Envio;
};

export function aceptarEnvio(ctx: ContextoAceptacion): ResultadoAceptacion {
  const { transportista, envio, posicionTransportista, envioEnTransitoActual } = ctx;

  if (transportista.vehiculo === null) {
    throw new VehiculoNoRegistrado();
  }

  if (transportista.estado === "NO_DISPONIBLE") {
    throw new TransportistaNoDisponible();
  }

  if (envioEnTransitoActual !== null) {
    throw new TransportistaOcupado();
  }

  if (posicionTransportista === null) {
    throw new CoordenadasFaltantes();
  }

  if (!estaDisponibleParaAceptar(envio)) {
    throw new EnvioNoDisponible(envio.estado);
  }

  if (!admiteCategoriaPaquete(transportista.vehiculo.categoria, envio.categoriaPaquete)) {
    throw new CapacidadInsuficiente(
      transportista.vehiculo.categoria,
      envio.categoriaPaquete
    );
  }

  const envioActualizado: Envio = {
    ...transicionarEnvio(envio, "ACEPTADO"),
    transportistaDni: transportista.dni,
  };

  const transportistaActualizado = marcarOcupado(transportista);

  return { transportistaActualizado, envioActualizado };
}
