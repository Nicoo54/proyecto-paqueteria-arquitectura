import { EnvioDetalle } from "../types/detalleEnvio";

// TODO: Reemplazar por llamada real a la API
export const detalleEnvioService = {
  async obtenerDetalle(id: string): Promise<EnvioDetalle> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          codigo_envio: id,
          categoria_paquete: "Mediano (M)",
          origen_direccion: "Mitre 150, Bahía Blanca, Buenos Aires",
          destino_direccion: "Av. Alem 1253, Bahía Blanca, Buenos Aires",
          condicion_climatica: "Despejado, 18°C",
          estado: "EN_CAMINO",
          costo: 1850.5,
          created_at: "12 de Junio de 2026 a las 14:32",
          transportista: {
            nombre: "Carlos M.",
            vehiculo: "Honda Titan (AB123CD)",
            rating: 4.8,
          },
        });
      }, 400);
    });
  },
};
