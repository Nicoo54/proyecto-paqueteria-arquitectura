import { EnvioDB, EstadoEnvio } from "../types";

// TODO: Reemplazar por llamadas reales a la API
export const viajeService = {
  async fetchEnvio(id: string): Promise<EnvioDB> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          codigo_envio: id,
          estado: "ASIGNADO",
          origen_direccion: "Mitre 150, Bahía Blanca",
          origen_lat: -38.7183,
          origen_lng: -62.2663,
          destino_direccion: "Alem 1253, Bahía Blanca",
          destino_lat: -38.6983,
          destino_lng: -62.2463,
        });
      }, 600);
    });
  },

  // PATCH /api/envios/:id/estado
  async actualizarEstadoEnvio(
    id: string,
    nuevoEstado: EstadoEnvio,
  ): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 800));
  },
};
