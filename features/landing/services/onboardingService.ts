import { ApiFetch } from "@/shared/api-client";

export const onboardingService = {
  async registrarRemitente(dni: string, apiFetch: ApiFetch): Promise<void> {
    await apiFetch("/api/remitentes", {
      method: "POST",
      body: JSON.stringify({ dni }),
    });
  },

  async registrarTransportista(
    datos: {
      dni: string;
      categoria: string;
      patente: string;
      aliasBancario: string;
    },
    apiFetch: ApiFetch,
  ): Promise<void> {
    await apiFetch("/api/transportistas", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },
};
