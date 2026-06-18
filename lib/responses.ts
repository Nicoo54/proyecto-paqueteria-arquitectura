
import { envio, ticket, transaccion } from '@prisma/client';

export function ResponseEnvio(envio: envio) { 

    return {
        categoriaPaquete: envio.categoria_paquete,
        dniRemitente: envio.dni_remitente,
        origenDireccion: envio.origen_direccion,
        origenLat: envio.origen_lat,
        origenLng: envio.origen_lng,
        destinoDireccion: envio.destino_direccion,
        destinoLat: envio.destino_lat,
        destinoLng: envio.destino_lng,
        condicionClimatica: envio.condicion_climatica,
        estado: envio.estado,
        costo: envio.costo,

        ...(envio.dni_transportista !== null && {
            transportistaDni: envio.dni_transportista,
        }),

        ...(envio.codigo_zona_caliente !== null && {
            zonaCalienteId: envio.codigo_zona_caliente,
        }),

        createdAt: envio.created_at,
        updatedAt: envio.updated_at,

        id: envio.codigo_envio,
    };
}

export function ResponseEnvios(envios: envio[]) {
    const r = [];

    for (const envio of envios) {
        r.push(ResponseEnvio(envio));
    }

    return r;
}

export function ResponseTicket(ticket: ticket) {
    return {
        codigoReclamo: ticket.codigo_reclamo,
        codigoSeguimiento: ticket.codigo_seguimiento,
        motivo: ticket.motivo,
        estado: ticket.estado,
        creadoEn: ticket.created_at,

        ...(ticket.dni_soporte_tecnico !== null && {
            dniSoporteTecnico: ticket.dni_soporte_tecnico
        }),

        ...(ticket.resolucion !== null && {
            resolucion: ticket.resolucion
        }),
    };
}

export function ResponseTickets(tickets: ticket[]) {
    const r = [];

    for(const ticket of tickets) {
        r.push(ResponseTicket(ticket));
    }

    return r;
}

export function ResponseFacturas(transacciones: transaccion[]) {
    const r = [];

    for (const transaccion of transacciones) {
        r.push({
            id: transaccion.id_referencia_externa,
            montoTotal: transaccion.monto_total,
            emitidaEn: transaccion.created_at,
            urlDescarga: "?"
        });
    }

    return r;
}