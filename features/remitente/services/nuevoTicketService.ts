import {
  NuevoTicketPayload,
  NuevoTicketResponse,
} from "../types/ticketDetalle";

export const nuevoTicketService = {
  async crearTicket(payload: NuevoTicketPayload): Promise<NuevoTicketResponse> {
    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        envioId: payload.codigo_seguimiento,
        motivo: payload.motivo,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error creando ticket: ${response.statusText}`);
    }

    const data = await response.json();
    return { id: `TK-${data.codigoReclamo}` };
  },
};
