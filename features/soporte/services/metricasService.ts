import {
  ConsolidadorMetricas,
  ZonaCalienteDB,
} from "@/features/soporte/types/metricas";
import { ApiFetch } from "@/shared/api-client";
import { formatearFechaRelativa } from "@/shared/dateUtils";

// Dejo esto para hacer el video de la demo. En producción, se debería eliminar
// y usar siempre la API real.
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export const metricasService = {
  async obtenerMétricasBatch(
    apiFetch: ApiFetch,
  ): Promise<ConsolidadorMetricas | null> {
    const res = await apiFetch("/api/metricas");

    if (!res.data) return null;

    return {
      fecha_reporte: formatearFechaRelativa(res.data.fechaReporte),
      cantidad_envios_totales: res.data.cantidadEnviosTotales,
      ganancia_neta_plataforma: res.data.gananciaNetaPlataforma,
    };
  },

  async obtenerZonasCalientes(apiFetch: ApiFetch): Promise<ZonaCalienteDB[]> {
    if (USE_MOCKS) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              codigo_zona_caliente: "1",
              centro_lat: -38.7183,
              centro_lng: -62.2663,
              radio_m: 1200,
              multiplicador_precio: 1.5,
            },
          ]);
        }, 400);
      });
    }
    const res = await apiFetch("/api/zonas-calientes");

    return res.data.map((z: any) => ({
      codigo_zona_caliente: z.codigo,
      centro_lat: z.centroLat,
      centro_lng: z.centroLng,
      radio_m: z.radioM,
      multiplicador_precio: z.multiplicadorPrecio,
    }));
  },
};
