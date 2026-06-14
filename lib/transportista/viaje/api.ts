import { EnvioDB, EstadoEnvio } from "./types";

// TODO: Remplazar por llamada real a la API
export const fetchEnvio = async (id: string): Promise<EnvioDB> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        codigo_envio: id,
        estado: "ASIGNADO",
        origen_direccion: "Mitre 150, Bahía Blanca",
        origen_lat: -38.7183,
        origen_lng: -62.2663,
        destino_direccion: "Alem 1253, Bahía Blanca",
        destino_lat: -38.6983,
        destino_lng: -62.2463,
      });
    }, 600);
  });
};

// TODO: Remplazar por llamada real a la API
export const actualizarEstadoEnvio = async (
  id: string,
  nuevoEstado: EstadoEnvio,
): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 800));
};
