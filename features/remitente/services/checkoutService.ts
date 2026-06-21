import { ApiFetch } from "@/shared/api-client";
import { DraftEnvio } from "../types/checkout";

export const checkoutService = {
  async generarLinkMercadoPago(
    draft: DraftEnvio,
    apiFetch: ApiFetch,
  ): Promise<string> {
    const payload = {
      origenDireccion: draft.origen!.nombre,
      origenLat: draft.origen!.lat,
      origenLng: draft.origen!.lng,
      destinoDireccion: draft.destino!.nombre,
      destinoLat: draft.destino!.lat,
      destinoLng: draft.destino!.lng,
      categoriaPaquete: draft.tamanoSeleccionado,
      precioCalculado: draft.cotizacion!.precio,
      tipoPago: "DIGITAL",
    };

    const data = await apiFetch("/api/envios", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return data.paymentLink;
  },
};
