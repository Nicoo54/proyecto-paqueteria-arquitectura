import { ViajeDetalle, ViajeHistorial } from "@/lib/transportista/viaje/types";

// TODO: Remplazar
export const viajesService = {
  async obtenerHistorialViajes(): Promise<{
    viajes: ViajeHistorial[];
    totalGanado: number;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const viajes = [
          {
            codigo_envio: "1004",
            fecha: "15 Jun, 2026",
            origen_direccion: "Mitre 150",
            destino_direccion: "Alem 1253",
            monto_ganado: 2150.5,
            zona_caliente_aplicada: true,
          },
          {
            codigo_envio: "1002",
            fecha: "10 Jun, 2026",
            origen_direccion: "Sarmiento 210",
            destino_direccion: "Vieytes 840",
            monto_ganado: 1200.0,
            zona_caliente_aplicada: false,
          },
          {
            codigo_envio: "0985",
            fecha: "04 Jun, 2026",
            origen_direccion: "Estomba 88",
            destino_direccion: "Av. Colon 432",
            monto_ganado: 2600.0,
            zona_caliente_aplicada: true,
          },
        ];
        const totalGanado = viajes.reduce((acc, v) => acc + v.monto_ganado, 0);

        resolve({ viajes, totalGanado });
      }, 800);
    });
  },

  // TODO: Remplazar
  async obtenerDetalleViaje(id: string): Promise<ViajeDetalle> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          codigo_envio: id,
          fecha: "15 de Junio de 2026 a las 14:55",
          origen_direccion: "Mitre 150, Bahía Blanca, Buenos Aires",
          destino_direccion: "Av. Alem 1253, Bahía Blanca, Buenos Aires",
          categoria_paquete: "Mediano (M)",
          monto_base: 1650.0,
          bonificaciones_aplicadas: {
            zona_caliente: 350.0,
            clima_extremo: 150.5,
          },
          monto_total_percibido: 2150.5,
        });
      }, 500);
    });
  },
};
