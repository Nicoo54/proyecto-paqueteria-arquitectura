import { TicketGestionDetalle } from "@/lib/types/ticketGestion";

// TODO: Remplazar por llamada a API
export const gestionTicketService = {
  async obtenerDetalleTicket(id: string): Promise<TicketGestionDetalle> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          codigo_reclamo: id,
          codigo_seguimiento: "1004",
          motivo:
            "El paquete llegó mojado y la caja está rota. Exijo el reembolso inmediato.",
          estado: "EN_PROGRESO", // El Helper acaba de tomarlo en la pantalla anterior
          created_at: "15 Jun, 2026 - 10:30 AM",
          remitente: {
            nombre: "Martín G.",
            dni: "35123456",
          },
          envio: {
            origen: "Mitre 150, Bahía Blanca",
            destino: "Alem 1253, Bahía Blanca",
            estado: "ENTREGADO",
            costo: 1850.5,
          },
        });
      }, 700);
    });
  },

  // TODO: Remplazar por llamada a API
  async resolverTicket(id: string, resolucion: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 1200);
    });
  },
};
