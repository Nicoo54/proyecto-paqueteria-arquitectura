import { ApiFetch } from "@/shared/api-client";
import { PaqueteDisponible } from "../types/types";
import { API_ENDPOINTS, CategoriaVehiculo, EnvioDto } from "@/lib/api-contract";

export const radarService = {
  // TODO: Cambiar por GET /api/transportistas/me/viaje-activo
  async obtenerViajeActivo(apiFetch: ApiFetch): Promise<{ id: string } | null> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(null), 600);
    });
  },

  async obtenerPaquetesDisponibles(
    lat: number,
    lng: number,
    radioKm: number,
    apiFetch: ApiFetch,
  ): Promise<PaqueteDisponible[]> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radioKm: radioKm.toString(),
    });

    const envios: EnvioDto[] = await apiFetch(
      `${API_ENDPOINTS.ENVIOS.EXPLORAR}?${params.toString()}`,
    );

    const detallesEnvio = await calcularDistanciaYTiempo(
      lat,
      lng,
      envios,
      // Para no modificar el front asumimos que es un auto (el calculo deberia hacerse en el back)
      "AUTO",
    );

    return envios.map((envio, index) => ({
      id: envio.id.toString(),
      origen: envio.origenDireccion,
      destino: envio.destinoDireccion,
      ganancia: envio.costo * 0.7, // Esto deberia venir calculado del backend idealmente
      distancia: detallesEnvio[index].distancia,
      tiempoAprox: detallesEnvio[index].tiempoAprox,
      tamano: envio.categoriaPaquete,
    }));
  },

  // TODO: Cambiar por PATCH /api/envios/:id/aceptar
  async aceptarViaje(id: string, apiFetch: ApiFetch): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 1200);
    });
  },
};

// Esto deberia hacerlo el backend pero como no
// venia en el contrato lo hago acá para mostrar algo en la UI
async function calcularDistanciaYTiempo(
  origenLat: number,
  origenLng: number,
  envios: EnvioDto[],
  categoriaVehiculo: CategoriaVehiculo,
) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token || envios.length === 0) {
    return envios.map(() => ({ distancia: "N/A", tiempoAprox: "N/A" }));
  }

  const profile = categoriaVehiculo === "BICI" ? "cycling" : "driving";

  // Al usar paginacion limitar a 24 envios porque la API de Matrix de Mapbox tiene un limite de 25 coordenadas (1 origen + 24 destinos)
  const enviosLimitados = envios.slice(0, 24);
  const destinosStr = enviosLimitados
    .map((e) => `${e.origenLng},${e.origenLat}`)
    .join(";");

  const coordinates = `${origenLng},${origenLat};${destinosStr}`;

  const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/${profile}/${coordinates}?sources=0&annotations=distance,duration&access_token=${token}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return envios.map((_, index) => {
      if (index >= 24) return { distancia: "N/A", tiempoAprox: "N/A" }; // Por si hay más de 24

      const distMetros = data.distances[0][index + 1];
      const durSegundos = data.durations[0][index + 1];

      return {
        distancia: distMetros ? `${(distMetros / 1000).toFixed(1)} km` : "N/A",
        tiempoAprox: durSegundos
          ? `${Math.round(durSegundos / 60)} min`
          : "N/A",
      };
    });
  } catch (error) {
    console.error("Fallo la Matrix API de Mapbox:", error);
    return envios.map(() => ({ distancia: "N/A", tiempoAprox: "N/A" }));
  }
}
