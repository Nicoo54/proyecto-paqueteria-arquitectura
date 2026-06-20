import {
  ViajeDetalle,
  ViajeHistorial,
} from "@/features/transportista/viaje/types";
import { API_ENDPOINTS, EnvioDto, PaginatedResponse } from "@/lib/api-contract";
import { ApiFetch } from "@/shared/api-client";
import { formatearFecha } from "@/shared/dateUtils";

export const viajesService = {
  async obtenerHistorialViajes(apiFetch: ApiFetch): Promise<{
    viajes: ViajeHistorial[];
    totalGanado: number;
  }> {
    const response: PaginatedResponse<EnvioDto> = await apiFetch(
      API_ENDPOINTS.TRANSPORTISTA.HISTORIAL,
    );

    // TODO (Próxima Etapa): Manejar response.meta para hacer scroll infinito o botones de paginación.
    // Por ahora, solo extraemos la primera página de datos.
    // aqui devuelve items y envios, mire la logica y no entendi la diferencia entre ambos,
    // revisar con el equipo de backend para unificar la respuesta y evitar confusiones.
    const envios = response.envios || [];

    const viajesMapeados: ViajeHistorial[] = envios.map((envio) => ({
      codigo_envio: envio.id.toString(),
      origen_direccion: envio.origenDireccion,
      destino_direccion: envio.destinoDireccion,
      // Si existe el envio siempre va a tener createdAt, en backend puede estar undefined
      // (parece mal diseño, revisar) por eso el fallback.
      fecha: formatearFecha(envio.createdAt?.toString() || "Fecha desconocida"),
      monto_ganado: envio.costo,
      zona_caliente_aplicada: envio.zonaCalienteId ? true : false,
    }));

    // Esto deberia obtenerse directamente del backend para evitar inconsistencias,
    // pero lo calculamos aquí para tener una idea de la ganancia total porq no hay endpoint expuesto.
    const totalGanado = viajesMapeados.reduce(
      (acc, viaje) => acc + viaje.monto_ganado,
      0,
    );

    return {
      viajes: viajesMapeados,
      totalGanado,
    };
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
