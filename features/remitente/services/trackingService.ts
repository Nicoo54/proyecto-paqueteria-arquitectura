import { EnvioTracking } from "../types/tracking";

// TODO: Reemplazar esta función mock por una llamada real a la API
export const trackingService = {
  async obtenerEnvioTracking(id: string): Promise<EnvioTracking> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          codigo_envio: id,
          estado: "BUSCANDO", // cambiar esto a "ENTREGADO" o "BUSCANDO..." para probar la UI
          origen_direccion: "Mitre 150, Bahía Blanca",
          origen_lat: -38.7183,
          origen_lng: -62.2663,
          destino_direccion: "Alem 1253, Bahía Blanca",
          destino_lat: -38.6983,
          destino_lng: -62.2463,
          chofer: {
            nombre: "Carlos M.",
            vehiculo: "Honda Titan 150cc",
            rating: 4.8,
          },
        });
      }, 800);
    });
  },
};
