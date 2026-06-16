// TODO: Remplazar a llamada real a la API
export const onboardingService = {
  async registrarRemitente(dni: string): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  },

  // TODO: Remplazar a llamada real a la API
  async registrarTransportista(datos: {
    dni: string;
    categoria: string;
    patente: string;
    aliasBancario: string;
  }): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  },
};
