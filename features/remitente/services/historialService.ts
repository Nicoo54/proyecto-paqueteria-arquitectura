import { EnvioHistorial } from "../types/historial";

export const historialService = {
  async obtenerHistorial(): Promise<EnvioHistorial[]> {
    const response = await fetch("/api/usuarios/me/envios");
    
    if (!response.ok) {
      console.error("Error fetching historial", response.statusText);
      return [];
    }

    const json = await response.json();
    return json.data.map((envio: any) => ({
      codigo_envio: envio.id.toString(),
      fecha: new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(new Date(envio.createdAt)),
      destino: envio.destinoDireccion,
      categoria: envio.categoriaPaquete,
      costo: envio.costo,
      estado: envio.estado,
    }));
  },
};
