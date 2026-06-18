import type { Coordenada, Dni } from "../../domain/types";
import type { EstadoTransportista, Transportista } from "../../domain/transportista/types";

export type ActualizacionUbicacion = {
  lat: number;
  lng: number;
  timestamp: Date;
};

export interface TransportistaRepository {
  obtenerPorDni(dni: Dni): Promise<Transportista | null>;

  guardar(transportista: Transportista): Promise<Transportista>;

  actualizarEstado(dni: Dni, estado: EstadoTransportista): Promise<void>;

  actualizarUbicacion(dni: Dni, ubicacion: ActualizacionUbicacion): Promise<void>;

  obtenerUltimaUbicacion(dni: Dni): Promise<(Coordenada & { timestamp: Date }) | null>;
}
