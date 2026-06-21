import { API_ENDPOINTS } from "@/lib/api-contract";
import { EnvioDetalle } from "../types/detalleEnvio";

export const detalleEnvioService = {
  async obtenerDetalle(id: string): Promise<EnvioDetalle> {
    const response = await fetch(`/api/envios/${id}`);

    if (!response.ok) {
      throw new Error(`Error fetching detalle: ${response.statusText}`);
    }

    const envio = await response.json();

    // Idealmente deberíamos tener esta información en la respuesta del envío para evitar una
    // llamada adicional pero por ahora hacemos esta consulta para obtener los detalles del
    // transportista asignado.
    const detallesTransportista = await fetch(
      API_ENDPOINTS.TRANSPORTISTA.DETALLE(envio.transportistaDni),
    ).then((r) => r.json());
    return {
      codigo_envio: envio.id.toString(),
      categoria_paquete: envio.categoriaPaquete,
      origen_direccion: envio.origenDireccion,
      destino_direccion: envio.destinoDireccion,
      condicion_climatica: envio.condicionClimatica,
      estado: envio.estado,
      costo: envio.costo,
      created_at: new Intl.DateTimeFormat("es-AR", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(envio.createdAt)),
      transportista: envio.transportistaDni
        ? {
            nombre: detallesTransportista.nombre,
            vehiculo: detallesTransportista.vehiculo
              ? detallesTransportista.vehiculo.categoria
              : "Vehículo registrado",
            rating: detallesTransportista.promedioCalificacion,
          }
        : undefined,
    };
  },
};
