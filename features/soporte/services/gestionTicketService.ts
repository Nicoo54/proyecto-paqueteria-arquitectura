import { TicketGestionDetalle } from "@/features/soporte/types/ticketGestion";
import { ApiFetch } from "@/shared/api-client";
import { formatearFecha } from "@/shared/dateUtils";

export const gestionTicketService = {
  async obtenerDetalleTicket(
    id: string,
    apiFetch: ApiFetch,
  ): Promise<TicketGestionDetalle> {
    const data = await apiFetch(`/api/tickets/${id}`);
    console.warn("Datos recibidos del API:", data);
    return {
      codigo_reclamo: data.codigoReclamo.toString(),
      codigo_seguimiento: data.codigoSeguimiento.toString(),
      motivo: data.motivo,
      estado: data.estado,
      created_at: formatearFecha(data.creadoEn),
      remitente: {
        nombre: data.remitenteDetalle?.nombre || "Cliente",
        dni: data.remitenteDetalle?.dni || "Sin DNI",
      },
      envio: {
        origen: data.envioDetalle?.origen || "No disponible",
        destino: data.envioDetalle?.destino || "No disponible",
        estado: data.envioDetalle?.estadoEnvio || "DESCONOCIDO",
        costo: data.envioDetalle?.costo || 0,
      },
    };
  },

  async resolverTicket(
    id: string,
    resolucion: string,
    apiFetch: ApiFetch,
  ): Promise<void> {
    await apiFetch(`/api/tickets/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ estado: "RESUELTO", resolucion }),
    });
  },
};
