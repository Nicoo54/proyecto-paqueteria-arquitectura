import { EnvioActivo } from "../types/cliente";

// TODO: Reemplazar por llamadas reales a la API
export const clienteService = {
  async obtenerEnvioActivo(userId: string): Promise<EnvioActivo | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // MOCK: Cambiar a true para ver la tarjeta del viaje en curso
        const tieneEnvioActivo = false;

        if (!tieneEnvioActivo) {
          resolve(null);
        } else {
          resolve({
            id: "ENV-8472",
            estado: "EN_CAMINO",
            origen: "Av. Alem 1253",
            destino: "Sarmiento 456",
            chofer: {
              nombre: "Carlos M.",
              vehiculo: "Moto (AB123CD)",
              rating: 4.8,
            },
            eta: "15 min",
          });
        }
      }, 800);
    });
  },
};
