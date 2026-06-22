import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Coordenada } from "../features/transportista/viaje/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function distanciaKm(a: Coordenada, b: Coordenada) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(sa));
}

function formatearFecha(isoString: string): string {
  if (!isoString) return "Fecha desconocida";

  const fecha = new Date(isoString);
  return fecha
    .toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", " a las");
}
