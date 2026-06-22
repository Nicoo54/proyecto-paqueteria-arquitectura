import { EnvioTracking } from "../types/tracking";

export const trackingService = {
  async obtenerEnvioTracking(id: string): Promise<EnvioTracking> {
    const response = await fetch(`/api/envios/${id}`);
    console.warn(`Fetching tracking for envio ID: ${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching tracking: ${response.statusText}`);
    }

    const envio = await response.json();
    return {
      codigo_envio: envio.id.toString(),
      estado: envio.estado,
      origen_direccion: envio.origenDireccion,
      origen_lat: envio.origenLat,
      origen_lng: envio.origenLng,
      destino_direccion: envio.destinoDireccion,
      destino_lat: envio.destinoLat,
      destino_lng: envio.destinoLng,
      transportistaUltimaLat: envio.moto_lat,
      transportistaUltimaLng: envio.moto_lng,
      chofer: envio.transportistaDni
        ? {
            nombre: envio.transportistaDni,
            vehiculo: "Vehículo",
            rating: 5.0,
          }
        : undefined,
    };
  },
};
