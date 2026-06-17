import {
  TicketResuelto,
  TicketResueltoDetalle,
} from "@/features/soporte/types/historialSoporte";

// TODO: Cambiar a endpoint real
export const historialSoporteService = {
  async obtenerTicketsResueltos(): Promise<TicketResuelto[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            codigo_reclamo: "4085",
            codigo_seguimiento: "1003",
            fecha_resolucion: "12 de Junio, 2026",
            resolucion:
              "Se aprobó el reintegro de saldo por retraso crítico superior a 45 minutos imputable al transportista.",
          },
          {
            codigo_reclamo: "3992",
            codigo_seguimiento: "0954",
            fecha_resolucion: "28 de Mayo, 2026",
            resolucion:
              "Se contactó al transportista por vía alternativa. El paquete fue entregado correctamente en conserjería.",
          },
        ]);
      }, 600);
    });
  },

  // TODO: Cambiar endpoint
  async obtenerDetalleResuelto(id: string): Promise<TicketResueltoDetalle> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          codigo_reclamo: id,
          codigo_seguimiento: "1003",
          motivo:
            "El transportista canceló el viaje de forma imprevista luego de retirar el paquete y figuraba como retenido en el radar.",
          comentarios_soporte:
            "Se analizó la telemetría del GPS de la moto y se comprobó desperfecto mecánico severo en la vía pública.",
          resolucion:
            "Se aprobó el reintegro de saldo por retraso crítico superior a 45 minutos imputable al transportista.",
          fecha_resolucion: "12 de Junio de 2026 a las 18:15",
        });
      }, 400);
    });
  },
};
