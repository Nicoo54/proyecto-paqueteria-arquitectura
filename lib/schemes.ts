
export interface Envio {
    codigo_envio: number,
    categoria_paquete: string,
    dni_remitente: string,
    dni_transportista: string | null,
    codigo_zona_caliente: number | null,
    origen_direccion: string,
    origen_lat: number,
    origen_lng: number,
    destino_direccion: string,
    destino_lat: number,
    destino_lng: number,
    condicion_climatica: string,
    estado: string,
    costo: number,
    created_at: Date,
    updated_at: Date
}

export interface Ticket {
    codigo_reclamo: number,
    codigo_seguimiento: number,
    dni_soporte_tecnico: string | null,
    motivo: string,
    resolucion: string | null,
    estado: string,
    created_at: Date,
    updated_at: Date
}