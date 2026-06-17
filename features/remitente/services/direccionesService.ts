import { Ubicacion } from "@/shared/types/ubicacion";
import { DireccionGuardada, NuevaDireccionPayload } from "../types/direccione";

// TODO: Cambiar a API real cuando esté lista
export const direccionesService = {
  async obtenerDirecciones(): Promise<DireccionGuardada[]> {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            {
              id_direccion: 1,
              direccion: "Mitre 150",
              ciudad: "Bahía Blanca",
              origen_lat: -38.7183,
              origen_lng: -62.2663,
            },
            {
              id_direccion: 2,
              direccion: "Sarmiento 210",
              ciudad: "Bahía Blanca",
              origen_lat: -38.72,
              origen_lng: -62.27,
            },
          ]),
        600,
      ),
    );
  },

  async guardarDireccion(payload: NuevaDireccionPayload): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 800);
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
