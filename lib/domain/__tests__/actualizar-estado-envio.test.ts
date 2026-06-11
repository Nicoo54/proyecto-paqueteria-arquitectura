import {
  CoordenadasFaltantes,
  TransicionInvalida,
  TransportistaOcupado,
} from "../errors";
import { actualizarEstadoEnvio } from "../transportista/actualizar-estado-envio";
import { describe, it, expect } from "./_runner";
import {
  envioAceptado,
  envioBuscando,
  posicionEnOrigen,
  transportistaOcupado,
} from "./_fixtures";

const envioRetirado = { ...envioAceptado, estado: "RETIRADO" as const };
const envioEnCamino = { ...envioAceptado, estado: "EN_CAMINO" as const };

describe("actualizarEstadoEnvio - happy path", () => {
  it("ACEPTADO → RETIRADO con posición y sin otro envío en tránsito", () => {
    const { transportistaActualizado, envioActualizado } = actualizarEstadoEnvio({
      transportista: transportistaOcupado,
      envio: envioAceptado,
      nuevoEstado: "RETIRADO",
      posicionTransportista: posicionEnOrigen,
      otroEnvioEnTransito: null,
    });
    expect(envioActualizado.estado).toBe("RETIRADO");
    expect(transportistaActualizado.estado).toBe("OCUPADO");
  });

  it("RETIRADO → EN_CAMINO no requiere coords", () => {
    const { envioActualizado } = actualizarEstadoEnvio({
      transportista: transportistaOcupado,
      envio: envioRetirado,
      nuevoEstado: "EN_CAMINO",
      posicionTransportista: null,
      otroEnvioEnTransito: null,
    });
    expect(envioActualizado.estado).toBe("EN_CAMINO");
  });

  it("EN_CAMINO → ENTREGADO libera al transportista a DISPONIBLE", () => {
    const { transportistaActualizado, envioActualizado } = actualizarEstadoEnvio({
      transportista: transportistaOcupado,
      envio: envioEnCamino,
      nuevoEstado: "ENTREGADO",
      posicionTransportista: posicionEnOrigen,
      otroEnvioEnTransito: null,
    });
    expect(envioActualizado.estado).toBe("ENTREGADO");
    expect(transportistaActualizado.estado).toBe("DISPONIBLE");
  });
});

describe("actualizarEstadoEnvio - falla", () => {
  it("TransicionInvalida si el envío no es de este transportista", () => {
    const envioDeOtro = { ...envioAceptado, transportistaDni: "11111111" };
    expect(() =>
      actualizarEstadoEnvio({
        transportista: transportistaOcupado,
        envio: envioDeOtro,
        nuevoEstado: "RETIRADO",
        posicionTransportista: posicionEnOrigen,
        otroEnvioEnTransito: null,
      })
    ).toThrow(TransicionInvalida);
  });

  it("CoordenadasFaltantes al marcar RETIRADO sin coords", () => {
    expect(() =>
      actualizarEstadoEnvio({
        transportista: transportistaOcupado,
        envio: envioAceptado,
        nuevoEstado: "RETIRADO",
        posicionTransportista: null,
        otroEnvioEnTransito: null,
      })
    ).toThrow(CoordenadasFaltantes);
  });

  it("TransportistaOcupado si intenta marcar RETIRADO con otro envío en tránsito", () => {
    expect(() =>
      actualizarEstadoEnvio({
        transportista: transportistaOcupado,
        envio: envioAceptado,
        nuevoEstado: "RETIRADO",
        posicionTransportista: posicionEnOrigen,
        otroEnvioEnTransito: envioEnCamino,
      })
    ).toThrow(TransportistaOcupado);
  });

  it("TransicionInvalida si intenta saltar de ACEPTADO a ENTREGADO", () => {
    expect(() =>
      actualizarEstadoEnvio({
        transportista: transportistaOcupado,
        envio: envioAceptado,
        nuevoEstado: "ENTREGADO",
        posicionTransportista: posicionEnOrigen,
        otroEnvioEnTransito: null,
      })
    ).toThrow(TransicionInvalida);
  });

  it("CoordenadasFaltantes al marcar ENTREGADO sin coords", () => {
    expect(() =>
      actualizarEstadoEnvio({
        transportista: transportistaOcupado,
        envio: envioEnCamino,
        nuevoEstado: "ENTREGADO",
        posicionTransportista: null,
        otroEnvioEnTransito: null,
      })
    ).toThrow(CoordenadasFaltantes);
  });
});

describe("actualizarEstadoEnvio - cancelación", () => {
  it("CANCELADO libera al transportista a DISPONIBLE sin requerir coords", () => {
    const { transportistaActualizado, envioActualizado } = actualizarEstadoEnvio({
      transportista: transportistaOcupado,
      envio: envioAceptado,
      nuevoEstado: "CANCELADO",
      posicionTransportista: null,
      otroEnvioEnTransito: null,
    });
    expect(envioActualizado.estado).toBe("CANCELADO");
    expect(transportistaActualizado.estado).toBe("DISPONIBLE");
  });

  it("CANCELADO desde BUSCANDO no aplica al transportista (envío sin asignar)", () => {
    expect(() =>
      actualizarEstadoEnvio({
        transportista: transportistaOcupado,
        envio: envioBuscando,
        nuevoEstado: "CANCELADO",
        posicionTransportista: null,
        otroEnvioEnTransito: null,
      })
    ).toThrow(TransicionInvalida);
  });
});
