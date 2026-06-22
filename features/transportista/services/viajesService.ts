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

  async obtenerDetalleViaje(
    id: string,
    apiFetch: ApiFetch,
  ): Promise<ViajeDetalle> {
    const response: PaginatedResponse<EnvioDto> = await apiFetch(
      API_ENDPOINTS.TRANSPORTISTA.HISTORIAL,
    );

    // No parece correcto hacer otra llamada al mismo endpoint para obtener el detalle
    // de un viaje específico, pero dado que no hay un endpoint dedicado para esto,
    // filtramos la respuesta para encontrar el viaje deseado.
    // Esto es ineficiente y debería ser revisado con el equipo de backend para exponer
    // un endpoint específico que devuelva el detalle de un viaje por su ID.
    // y el historial debería devolver solo los datos necesarios para la lista, no toda la info del viaje.
    const envios = response.envios || [];
    const envio = envios.find((e) => e.id.toString() === id);

    if (!envio) {
      throw new Error("Viaje no encontrado");
    }

    const envioMapeado: ViajeDetalle = {
      codigo_envio: envio.id.toString(),
      fecha: formatearFecha(envio.createdAt?.toString() || "Fecha desconocida"),
      origen_direccion: envio.origenDireccion,
      destino_direccion: envio.destinoDireccion,
      categoria_paquete: envio.categoriaPaquete,
      monto_base: envio.costo,
      bonificaciones_aplicadas: {
        zona_caliente: envio.zonaCalienteId ? envio.costo * 0.2 : 0,
        clima_extremo: envio.condicionClimatica ? envio.costo * 0.1 : 0, // Esto es solo un ejemplo, la lógica real de bonificaciones debería ser definida por el backend y no calculada en el frontend para evitar inconsistencias.
      },
      monto_total_percibido: envio.costo * 0.7, // Este valor debería ser calculado o proporcionado por el backend, pero lo dejamos en 0 por ahora.
    };

    return envioMapeado;
  },
};
