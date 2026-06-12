import type { Coordenada, Dni } from "../../domain/types";
import type { EstadoTransportista, Transportista } from "../../domain/transportista/types";
import type {
  ActualizacionUbicacion,
  TransportistaRepository,
} from "../repositories";

export class InMemoryTransportistaRepository implements TransportistaRepository {
  private readonly transportistas = new Map<Dni, Transportista>();
  private readonly ubicaciones = new Map<Dni, Coordenada & { timestamp: Date }>();

  cargar(t: Transportista): void {
    this.transportistas.set(t.dni, t);
  }

  cargarVarios(ts: Transportista[]): void {
    for (const t of ts) this.cargar(t);
  }

  todos(): Transportista[] {
    return Array.from(this.transportistas.values());
  }

  async obtenerPorDni(dni: Dni): Promise<Transportista | null> {
    return this.transportistas.get(dni) ?? null;
  }

  async guardar(transportista: Transportista): Promise<Transportista> {
    this.transportistas.set(transportista.dni, transportista);
    return transportista;
  }

  async actualizarEstado(dni: Dni, estado: EstadoTransportista): Promise<void> {
    const t = this.transportistas.get(dni);
    if (t) this.transportistas.set(dni, { ...t, estado });
  }

  async actualizarUbicacion(dni: Dni, ubicacion: ActualizacionUbicacion): Promise<void> {
    this.ubicaciones.set(dni, { lat: ubicacion.lat, lng: ubicacion.lng, timestamp: ubicacion.timestamp });
  }

  async obtenerUltimaUbicacion(dni: Dni): Promise<(Coordenada & { timestamp: Date }) | null> {
    return this.ubicaciones.get(dni) ?? null;
  }
}
