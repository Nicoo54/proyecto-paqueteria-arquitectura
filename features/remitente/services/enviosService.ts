import { ApiFetch } from "@/shared/api-client";
import { EnvioActivo } from "../types/cliente";

export const enviosService = {
  async obtenerEnvioActivo(apiFetch: ApiFetch): Promise<EnvioActivo | null> {
    try {
      const response = await apiFetch("/api/remitentes/me/envios/activo");

      return response.data;
    } catch (error) {
      console.error("Error al obtener el envío activo:", error);
      return null;
    }
  },
};
