import { ApiFetch } from "@/shared/api-client";
import { TicketPendiente } from "../types/soporte";

export const soporteService = {
  async obtenerColaPendientes(apiFetch: ApiFetch): Promise<TicketPendiente[]> {
    const res = await apiFetch("/api/tickets/pendientes");
    return res.data;
  },

  async tomarTicket(id: string, apiFetch: ApiFetch): Promise<void> {
    await apiFetch(`/api/tickets/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        estado: "EN_ATENCION",
      }),
    });
  },
};
