import { Ubicacion } from "@/shared/types/ubicacion";
import { DireccionGuardada, NuevaDireccionPayload } from "../types/direccione";
import { ApiFetch } from "@/shared/api-client";

export const direccionesService = {
  async obtenerDirecciones(apiFetch: ApiFetch): Promise<DireccionGuardada[]> {
    const res = await apiFetch("/api/usuarios/me/direcciones");
    return res.data;
  },

  async guardarDireccion(
    payload: NuevaDireccionPayload,
    apiFetch: ApiFetch,
  ): Promise<void> {
    await apiFetch("/api/usuarios/me/direcciones", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export function direccionAUbicacion(d: DireccionGuardada): Ubicacion {
  return {
    nombre: d.ciudad ? `${d.direccion}, ${d.ciudad}` : d.direccion,
    lat: d.origen_lat,
    lng: d.origen_lng,
  };
}
