import { ApiFetch } from "@/shared/api-client";
import { EnvioDB, EstadoEnvio } from "../types";
import { API_ENDPOINTS } from "@/lib/api-contract";

export const viajeService = {
  async obtenerEnvio(id: string, apiFetch: ApiFetch): Promise<EnvioDB | null> {
    const response = await apiFetch(
      API_ENDPOINTS.TRANSPORTISTA.DETALLES_VIAJE_ACTIVO(id),
    );

    if (!response) {
      return null;
    }

    const envioMapeado: EnvioDB = {
      codigo_envio: response.id,
      estado: response.estado,
      origen_direccion: response.origenDireccion,
      origen_lat: response.origenLat,
      origen_lng: response.origenLng,
      destino_direccion: response.destinoDireccion,
      destino_lat: response.destinoLat,
      destino_lng: response.destinoLng,
    };

    return envioMapeado;
  },

  async actualizarEstadoEnvio(
    id: string,
    nuevoEstado: EstadoEnvio,
    apiFetch: ApiFetch,
  ): Promise<void> {
    return apiFetch(API_ENDPOINTS.ENVIOS.CAMBIAR_ESTADO(id), {
      method: "PATCH",
      body: JSON.stringify({ estado: nuevoEstado }),
    });
  },
};
