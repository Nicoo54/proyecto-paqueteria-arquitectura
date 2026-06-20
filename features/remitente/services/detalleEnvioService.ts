import { EnvioDetalle } from "../types/detalleEnvio";

export const detalleEnvioService = {
  async obtenerDetalle(id: string): Promise<EnvioDetalle> {
    const response = await fetch(`/api/envios/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching detalle: ${response.statusText}`);
    }

    const envio = await response.json();
    return {
      codigo_envio: envio.id.toString(),
      categoria_paquete: envio.categoriaPaquete,
      origen_direccion: envio.origenDireccion,
      destino_direccion: envio.destinoDireccion,
      condicion_climatica: envio.condicionClimatica,
      estado: envio.estado,
      costo: envio.costo,
      created_at: new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'long',
        timeStyle: 'short'
      }).format(new Date(envio.createdAt)),
      transportista: envio.transportistaDni ? {
        nombre: envio.transportistaDni, // Idealmente esto vendria con un join, pero sirve por ahora
        vehiculo: "Vehículo registrado",
        rating: 5.0,
      } : undefined,
    };
  },
};
