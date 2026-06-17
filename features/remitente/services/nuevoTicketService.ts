import {
  NuevoTicketPayload,
  NuevoTicketResponse,
} from "../types/ticketDetalle";

// TODO: Cambiar esta función para que haga una llamada real a la API
export const nuevoTicketService = {
  async crearTicket(payload: NuevoTicketPayload): Promise<NuevoTicketResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: "TK-4100" });
      }, 1000);
    });
  },
};
