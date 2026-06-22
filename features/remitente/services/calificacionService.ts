import { ApiFetch } from "@/shared/api-client";

export interface ResenaPayload {
  puntaje: number;
  comentario?: string;
}

export const calificacionService = {
  async enviarResena(
    codigoEnvio: string,
    payload: ResenaPayload,
    apiFetch: ApiFetch,
  ): Promise<void> {
    await apiFetch(`/api/envios/${codigoEnvio}/resenas`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
