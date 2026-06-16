import { PerfilTransportista } from "@/features/transportista/services/perfil";

// TODO: Reemplazar con llamadas reales a la API
export const perfilService = {
  async obtenerPerfil(): Promise<PerfilTransportista> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          categoria: "MOTO",
          patente: "A123BCD",
          alias_bancario: "packeteer.moto.carlos",
          cantidad_resenas: 24,
          promedio_calificacion: 4.85,
        });
      }, 600);
    });
  },

  // TODO: Reemplazar con llamadas reales a la API
  async actualizarPerfil(datos: Partial<PerfilTransportista>): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 1200);
    });
  },
};
