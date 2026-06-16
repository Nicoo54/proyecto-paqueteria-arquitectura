import { EnvioHistorial } from "../types/historial";

// TODO: Reemplazar por llamada real a la API
export const historialService = {
  async obtenerHistorial(): Promise<EnvioHistorial[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            codigo_envio: "1004",
            fecha: "12 Jun, 2026",
            destino: "Av. Alem 1253",
            categoria: "M",
            costo: 1850.5,
            estado: "EN_CAMINO",
          },
          {
            codigo_envio: "1003",
            fecha: "10 Jun, 2026",
            destino: "Mitre 150",
            categoria: "S",
            costo: 1200.0,
            estado: "ENTREGADO",
          },
          {
            codigo_envio: "1002",
            fecha: "05 Jun, 2026",
            destino: "Av. Colon 432",
            categoria: "L",
            costo: 2900.0,
            estado: "ENTREGADO",
          },
          {
            codigo_envio: "1001",
            fecha: "01 Jun, 2026",
            destino: "Estomba 88",
            categoria: "M",
            costo: 1850.5,
            estado: "CANCELADO",
          },
        ]);
      }, 800);
    });
  },
};
