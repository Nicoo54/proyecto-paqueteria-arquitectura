import { TicketPendiente } from "@/features/soporte/types/soporte";

// TODO: Cambiar a fetch a la API real cuando esté lista
export const soporteService = {
  async obtenerColaPendientes(): Promise<TicketPendiente[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            codigo_reclamo: "4095",
            codigo_seguimiento: "1004",
            motivo:
              "El paquete llegó mojado y la caja está rota. Exijo el reembolso.",
            estado: "PENDIENTE",
            created_at: "Hace 10 min",
          },
          {
            codigo_reclamo: "4094",
            codigo_seguimiento: "1005",
            motivo:
              "El transportista figura en camino pero hace una hora está quieto en el mismo lugar.",
            estado: "PENDIENTE",
            created_at: "Hace 24 min",
          },
          {
            codigo_reclamo: "4091",
            codigo_seguimiento: "1001",
            motivo:
              "Error al procesar el pago con MercadoPago, me debitaron el dinero pero figura pendiente.",
            estado: "PENDIENTE",
            created_at: "Hace 2 horas",
          },
        ]);
      }, 700);
    });
  },

  // TODO: cambiar a fetch a la API real cuando esté lista
  async tomarTicket(id: string, dniSoporte: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 800);
    });
  },
};
