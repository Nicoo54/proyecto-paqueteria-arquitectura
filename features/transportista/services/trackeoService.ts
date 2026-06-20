import { API_ENDPOINTS } from "@/lib/api-contract";
import { ApiFetch } from "@/shared/api-client";

export const disponibilidadService = {
  async actualizarDisponibilidad(
    estado: boolean,
    apiFetch: ApiFetch,
  ): Promise<void> {
    return apiFetch(API_ENDPOINTS.TRANSPORTISTA.DISPONIBILIDAD, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disponible: estado }),
    });
  },

  async actualizarUbicacion(
    ubicacion: { latitud: number; longitud: number },
    apiFetch: ApiFetch,
  ): Promise<void> {
    return apiFetch(API_ENDPOINTS.TRANSPORTISTA.UBICACION, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: ubicacion.latitud, lng: ubicacion.longitud }),
    });
  },
};
