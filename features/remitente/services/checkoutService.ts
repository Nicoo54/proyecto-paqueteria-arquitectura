import { DraftEnvio } from "../types/checkout";

// TODO: Cambiar por llamada real a nuestro backend que hable con MercadoPago
export const checkoutService = {
  async generarLinkMercadoPago(draft: DraftEnvio): Promise<string> {
    const response = await fetch("/api/envios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origenDireccion: draft.origen?.nombre || "Dirección Desconocida",
        origenLat: draft.origen?.lat?.toString() || "-38.7183", // Default if missing
        origenLng: draft.origen?.lng?.toString() || "-62.2663",
        destinoDireccion: draft.destino?.nombre || "Dirección Desconocida",
        destinoLat: draft.destino?.lat?.toString() || "-38.6983",
        destinoLng: draft.destino?.lng?.toString() || "-62.2463",
        categoriaPaquete: draft.tamanoSeleccionado === "S" ? "PEQUENO" : draft.tamanoSeleccionado === "M" ? "MEDIANO" : "GRANDE",
        precioCalculado: draft.cotizacion?.precio || 0,
        tipoPago: "DIGITAL",
        metodoPagoToken: "MP_TOKEN_TEST" // Assuming this is set up or not required strictly in sandbox
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error creando envío: ${response.statusText}`);
    }

    const data = await response.json();
    return data.paymentLink || "https://mercadopago.com.ar/sandbox_link_falso";
  },
};
