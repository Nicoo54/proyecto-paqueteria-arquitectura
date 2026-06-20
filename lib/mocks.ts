import { Envio, Ticket } from "./schemes"

export const usuario = {
    dni: "34343",
    clark_id: "dgngou3r4noif",
    created_at: new Date()
}

export const remitenteMock = {
    dni: "654345",
}

export const direccion = {
    id_direccion: 42,
    remitente_dni: "34434",
    direccion: "Sarmiento 456",
    ciudad: "Bahía Blanca",
    provincia: "Buenos Aires",
    pais: "Argentina",
    codigo_postal: "8080",
    origen_lat: 342424,
    origen_lng: 345442,

    created_at: new Date(),
    updated_at: new Date()
}

export const categoriaPaqueteMediano = {
    categoria_paquete: "MEDIANO",
    peso_maximo: 43,
    multiplicador_costo: 1.4
}

export const envioBuscando : Envio = {
    codigo_envio: 10,
    categoria_paquete: "MEDIANO",
    dni_remitente: "234434",
    dni_transportista: null,
    codigo_zona_caliente: null,
    origen_direccion: "sas",
    origen_lat: 10,
    origen_lng: 10,
    destino_direccion: "sos",
    destino_lat: 11,
    destino_lng: 11,
    condicion_climatica: "DESPEJADO",
    estado: "BUSCANDO",
    costo: 1234,
    created_at: new Date(),
    updated_at: new Date(),
}

export const envioAceptado: Envio = {
    codigo_envio: 10,
    categoria_paquete: "MEDIANO",
    dni_remitente: "234434",
    dni_transportista: "876546",
    codigo_zona_caliente: null,
    origen_direccion: "sas",
    origen_lat: 10,
    origen_lng: 10,
    destino_direccion: "sos",
    destino_lat: 11,
    destino_lng: 11,
    condicion_climatica: "DESPEJADO",
    estado: "ACEPTADO",
    costo: 1234,
    created_at: new Date(),
    updated_at: new Date(),
}

export const envioEnCamino: Envio = {
    codigo_envio: 10,
    categoria_paquete: "MEDIANO",
    dni_remitente: "234434",
    dni_transportista: "876546",
    codigo_zona_caliente: null,
    origen_direccion: "sas",
    origen_lat: 10,
    origen_lng: 10,
    destino_direccion: "sos",
    destino_lat: 11,
    destino_lng: 11,
    condicion_climatica: "DESPEJADO",
    estado: "EN_CAMINO",
    costo: 1234,
    created_at: new Date(),
    updated_at: new Date(),
}

export const envioEntregado: Envio = {
    codigo_envio: 10,
    categoria_paquete: "MEDIANO",
    dni_remitente: "234434",
    dni_transportista: "876546",
    codigo_zona_caliente: null,
    origen_direccion: "sas",
    origen_lat: 10,
    origen_lng: 10,
    destino_direccion: "sos",
    destino_lat: 11,
    destino_lng: 11,
    condicion_climatica: "DESPEJADO",
    estado: "ENTREGADO",
    costo: 1234,
    created_at: new Date(),
    updated_at: new Date(),
}

export const resenaConComentario = {
    id_resena: 10,
    codigo_seguimiento: 43,
    puntaje: 4,
    comentario: "sas",

    created_at: new Date(),
    updated_at: new Date()
}

export const resenaSinComentario = {
    id_resena: 10,
    codigo_seguimiento: 43,
    puntaje: 4,
    comentario: null,

    created_at: new Date(),
    updated_at: new Date()
}

export const transaccion1 = {
    id_referencia_externa: "asdad-13",
    codigo_seguimiento: 53524,
    monto_total: 3423.5,
    estado_pago: "?",

    created_at: new Date(),
    updated_at: new Date()
}

export const transaccion2 = {
    id_referencia_externa: "hlosefks",
    codigo_seguimiento: 95384,
    monto_total: 135.5,
    estado_pago: "?",

    created_at: new Date(),
    updated_at: new Date()
}

export const transaccion3 = {
    id_referencia_externa: "nmgcndrgd245",
    codigo_seguimiento: 2592045,
    monto_total: 28783.5,
    estado_pago: "?",

    created_at: new Date(),
    updated_at: new Date()
}

export const ticketPendiente : Ticket = {
    codigo_reclamo: 53454,
    codigo_seguimiento: 434341,
    dni_soporte_tecnico: null,
    motivo: "sdafwesg",
    resolucion: null,
    estado: "PENDIENTE",

    created_at: new Date(),
    updated_at: new Date()
}

export const ticketEnProceso: Ticket = {
    codigo_reclamo: 53454,
    codigo_seguimiento: 434341,
    dni_soporte_tecnico: "395782",
    motivo: "sdafwesg",
    resolucion: null,
    estado: "EN_PROCESO",

    created_at: new Date(),
    updated_at: new Date()
}

export const ticketResuelto: Ticket = {
    codigo_reclamo: 53454,
    codigo_seguimiento: 434341,
    dni_soporte_tecnico: "395782",
    motivo: "sdafwesg",
    resolucion: "hrhtnhrdgfhd",
    estado: "RESUELTO",

    created_at: new Date(),
    updated_at: new Date()
}