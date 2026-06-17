import { Ubicacion } from "@/shared/types/ubicacion";
import {
  CotizacionRequest,
  CotizacionResponse,
  TamanoPaquete,
} from "../types/cotizacion";

// TODO: Cambiar a llamadas reales a la API cuando esté disponible
export const cotizacionService = {
  async cotizarEnvio(req: CotizacionRequest): Promise<CotizacionResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ precio: 1850.5, eta: "15-20 min", distancia: "3.2 km" });
      }, 1000);
    });
  },

  // TODO: Cambiar a llamadas reales a la API cuando esté disponible
  async obtenerTamanosDisponibles(): Promise<TamanoPaquete[]> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            { id: "S", label: "Pequeño", desc: "Llaves, doc.", icon: "✉️" },
            { id: "M", label: "Mediano", desc: "Caja zapatos", icon: "📦" },
            { id: "L", label: "Grande", desc: "Mochila", icon: "🛍️" },
          ]),
        800,
      );
    });
  },

  // Integración externa con Mapbox API
  async obtenerGeometriaRuta(
    origen: Ubicacion,
    destino: Ubicacion,
    token: string,
  ): Promise<any> {
    if (origen && destino) {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origen.lng},${origen.lat};${destino.lng},${destino.lat}?geometries=geojson&access_token=${token}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.routes?.[0]?.geometry || null;
    }
  },
};
