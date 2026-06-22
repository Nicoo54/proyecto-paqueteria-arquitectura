export function ResponseEnvio(envio: any) {
  return {
    id: envio.id,
    categoriaPaquete: envio.categoriaPaquete,
    dniRemitente: envio.remitenteDni,
    origenDireccion: envio.origenDireccion,
    origenLat: envio.origenLat,
    origenLng: envio.origenLng,
    destinoDireccion: envio.destinoDireccion,
    destinoLat: envio.destinoLat,
    destinoLng: envio.destinoLng,
    condicionClimatica: envio.condicionClimatica,
    estado: envio.estado,
    costo: envio.costo,
    tipoPago: envio.tipoPago,

    ...(envio.transportistaDni !== null && {
      transportistaDni: envio.transportistaDni,
    }),

    ...(envio.zonaCalienteId !== null && {
      zonaCalienteId: envio.zonaCalienteId,
    }),

    createdAt: envio.createdAt,
    updatedAt: envio.updatedAt,
  };
}

export function ResponseEnvios(envios: any[]) {
  return envios.map((envio) => ResponseEnvio(envio));
}

export function ResponseTicket(ticket: any) {
  return {
    codigoReclamo: ticket.id,
    codigoSeguimiento: ticket.envioId, // Reclamo follows EnvioId
    motivo: ticket.motivo,
    estado: ticket.estado,
    creadoEn: ticket.createdAt,
    actualizadoEn: ticket.updatedAt,
    ...(ticket.helperDni !== null && {
      dniSoporteTecnico: ticket.helperDni,
    }),

    ...(ticket.resolucion !== null && {
      resolucion: ticket.resolucion,
    }),

    nombreHelper: ticket.nombreHelper,
  };
}

export function ResponseTickets(tickets: any[]) {
  return tickets.map((ticket) => ResponseTicket(ticket));
}

export function ResponseFacturas(transacciones: any[]) {
  return transacciones.map((transaccion) => ({
    id: transaccion.idReferenciaExterna,
    montoTotal: transaccion.montoTotal,
    emitidaEn: transaccion.createdAt,
    urlDescarga: "?",
  }));
}
