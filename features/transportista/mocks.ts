import { PaqueteDisponible } from "./types/types";

// TODO: Cambiar por llamada real
export const fetchViajeActivo = async () => {
  return new Promise<{ id: string } | null>((resolve) => {
    setTimeout(() => resolve(null), 600);
  });
};

// TODO: Cambiar por llamada real
export const fetchPaquetesDisponibles = async () => {
  return new Promise<PaqueteDisponible[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1005",
          origen: "Mitre 150",
          destino: "Alem 1253",
          ganancia: 1480.4,
          distancia: "3.2 km",
          tiempoAprox: "15 min",
          tamano: "M",
        },
        {
          id: "1006",
          origen: "Sarmiento 210",
          destino: "Vieytes 840",
          ganancia: 950.0,
          distancia: "1.8 km",
          tiempoAprox: "8 min",
          tamano: "S",
        },
        {
          id: "1007",
          origen: "Estomba 88",
          destino: "Av. Colon 432",
          ganancia: 2320.0,
          distancia: "5.5 km",
          tiempoAprox: "22 min",
          tamano: "L",
        },
      ]);
    }, 1000);
  });
};
