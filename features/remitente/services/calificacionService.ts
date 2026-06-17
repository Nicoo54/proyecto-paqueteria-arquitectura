export interface ResenaPayload {
  codigo_seguimiento: string;
  puntaje: number;
  comentario: string;
}

// TODO: Cambiar esta función para que haga una llamada real a la API para calificar un envío.
export const calificacionService = {
  async enviarResena(payload: ResenaPayload): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 800);
    });
  },
};
