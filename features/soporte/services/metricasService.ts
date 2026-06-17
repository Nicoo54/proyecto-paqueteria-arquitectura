import {
  ConsolidadorMetricas,
  ZonaCalienteDB,
} from "@/features/soporte/types/metricas";

// TODO: Reemplazar con llamadas reales a la API cuando estén disponibles
export const metricasService = {
  async obtenerMétricasBatch(): Promise<ConsolidadorMetricas | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // MOCK DE EXCEPCIÓN: Cambiá esto a null para simular el caso de primer día de operación
        resolve({
          fecha_reporte: "Hoy",
          cantidad_envios_totales: 342,
          ganancia_neta_plataforma: 125430.8,
        });
      }, 700);
    });
  },

  // TODO: Cambiar a llamada real
  async obtenerZonasCalientes(): Promise<ZonaCalienteDB[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            codigo_zona_caliente: "1",
            centro_lat: -38.7183,
            centro_lng: -62.2663,
            radio_m: 1200, // 1.2 Km a la redonda
            multiplicador_precio: 1.5,
          },
        ]);
      }, 500);
    });
  },
};
