import { TicketHistorial } from "../types/soporte";

// TODO: Reemplazar por llamadas reales a la API
export const soporteService = {
  async obtenerHistorialTickets(): Promise<TicketHistorial[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "TK-4092",
            fecha: "15 Jun, 2026",
            asunto: "Paquete dañado",
            envio_id: "1004",
            soporte: "María L.",
            estado: "EN_PROGRESO",
          },
          {
            id: "TK-4085",
            fecha: "12 Jun, 2026",
            asunto: "Demora en la recolección",
            envio_id: "1003",
            soporte: "Juan P.",
            estado: "RESUELTO",
          },
          {
            id: "TK-4011",
            fecha: "02 Jun, 2026",
            asunto: "Chofer no respondía",
            envio_id: "1001",
            soporte: "Sin asignar",
            estado: "ABIERTO",
          },
        ]);
      }, 800);
    });
  },
};
