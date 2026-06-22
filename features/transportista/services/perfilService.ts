import {
  API_ENDPOINTS,
  type TransportistaDto,
  type VehiculoRequest,
} from "@/lib/api-contract";
import { ApiFetch } from "@/shared/api-client";

export const perfilService = {
  async obtenerPerfil(apiFetch: ApiFetch): Promise<TransportistaDto> {
    return apiFetch(API_ENDPOINTS.TRANSPORTISTA.PERFIL);
  },

  // TODO: Proxima etapa
  async actualizarAlias(
    datos: { aliasBancario: string },
    apiFetch: ApiFetch,
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 1200);
    });
  },

  async actualizarVehiculo(
    datos: VehiculoRequest,
    apiFetch: ApiFetch,
  ): Promise<void> {
    return apiFetch(API_ENDPOINTS.TRANSPORTISTA.VEHICULO, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
  },
};
