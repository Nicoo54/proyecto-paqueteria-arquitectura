import { TicketDetalle } from "../types/ticketDetalle";

export const ticketDetalleService = {
  // GET /api/clientes/me/tickets/:id
  async obtenerDetalleTicket(id: string): Promise<TicketDetalle> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: id,
          envio_id: "1004",
          asunto: "Paquete dañado",
          descripcion:
            "Hola, el conductor me entregó el paquete pero la caja estaba abollada en una de las esquinas. Necesito saber cómo proceder con el seguro de carga.",
          estado: "ABIERTO",
          fecha_creacion: "15 de Junio de 2026 a las 09:15",
          soporte: {
            nombre: "María L.",
            comentario:
              "Hola, lamentamos el inconveniente. Por favor, subí 3 fotos de la caja y del producto en su interior a este mismo hilo para activar la póliza con nuestra aseguradora.",
            conclusion:
              "Se aprobaron las fotos y se emitió el reembolso total a tu cuenta de MercadoPago. El caso queda cerrado.",
            fecha_respuesta: "15 de Junio de 2026 a las 11:30",
          },
        });
      }, 500);
    });
  },
};
