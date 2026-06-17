import { DraftEnvio } from "../types/checkout";

// TODO: Cambiar por llamada real a nuestro backend que hable con MercadoPago
export const checkoutService = {
  async generarLinkMercadoPago(draft: DraftEnvio): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("https://mercadopago.com.ar/sandbox_link_falso");
      }, 2000);
    });
  },
};
