import { Ubicacion } from "@/shared/types/ubicacion";
import {
  CotizacionRequest,
  CotizacionResponse,
  TamanoPaquete,
} from "../types/cotizacion";
import { ApiFetch } from "@/shared/api-client";

export const cotizacionService = {
  async cotizarEnvio(
    req: CotizacionRequest,
    apiFetch: ApiFetch,
  ): Promise<CotizacionResponse> {
    const payload = {
      categoriaPaquete: req.tamano,
      origenDireccion: req.origen?.nombre,
      destinoDireccion: req.destino?.nombre,
      origenLat: req.origen?.lat,
      origenLng: req.origen?.lng,
      destinoLat: req.destino?.lat,
      destinoLng: req.destino?.lng,
    };

    const res = await apiFetch("/api/envios/cotizaciones", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return {
      precio: res.precio,
      eta: `${res.tiempoEstimadoMinutos} min`,
    };
  },

  obtenerTamanosDisponibles(): TamanoPaquete[] {
    return [
      { id: "S", label: "Pequeño", desc: "Llaves, doc.", icon: "✉️" },
      { id: "M", label: "Mediano", desc: "Caja zapatos", icon: "📦" },
      { id: "L", label: "Grande", desc: "Mochila", icon: "🛍️" },
    ];
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
