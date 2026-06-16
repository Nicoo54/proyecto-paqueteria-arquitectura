export type PaqueteDisponible = {
  id: string;
  origen: string;
  destino: string;
  ganancia: number;
  distancia: string;
  tiempoAprox: string;
  tamano: "S" | "M" | "L";
};
