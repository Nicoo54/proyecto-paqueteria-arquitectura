import { describe, it, expect } from "../../domain/__tests__/_runner";
import {
  CapacidadInsuficiente,
  CoordenadasFaltantes,
  EnvioNoDisponible,
  PatenteInvalida,
  TransportistaNoDisponible,
  TransportistaOcupado,
  VehiculoNoRegistrado,
  VehiculoYaRegistrado,
} from "../../domain/errors";
import type { Envio } from "../../domain/envio/types";
import type { Transportista } from "../../domain/transportista/types";
import type { Vehiculo } from "../../domain/vehiculo/types";
import {
  InMemoryEnvioRepository,
  InMemoryTransportistaRepository,
  InMemoryUnitOfWork,
  InMemoryVehiculoRepository,
} from "../in-memory";
import {
  AceptarEnvioUseCase,
  ActualizarDisponibilidadUseCase,
  ActualizarEstadoEnvioUseCase,
  ActualizarUbicacionUseCase,
  ActualizarVehiculoUseCase,
  ExplorarEnviosUseCase,
  RegistrarVehiculoUseCase,
} from "../use-cases/transportista";

function transportistaBase(overrides: Partial<Transportista> = {}): Transportista {
  return {
    dni: "28987654",
    aliasBancario: "mi.alias@banco",
    cantidadResenas: 0,
    promedioCalificacion: 0,
    estado: "DISPONIBLE",
    vehiculo: { id: 1, categoria: "MOTO", patente: "AB123CD" },
    ...overrides,
  };
}

const ORIGEN = { lat: -38.718334, lng: -62.266321, direccion: "Av. Alem 1253" };
const DESTINO = { lat: -38.712451, lng: -62.254124, direccion: "Sarmiento 456" };

function envioBase(overrides: Partial<Envio> = {}): Envio {
  return {
    id: 1040,
    categoriaPaquete: "M",
    remitenteDni: "35123456",
    transportistaDni: null,
    zonaCalienteId: null,
    origen: ORIGEN,
    destino: DESTINO,
    condicionClimatica: "DESPEJADO",
    estado: "BUSCANDO",
    costo: 1850,
    ...overrides,
  };
}

function armar() {
  const transportistas = new InMemoryTransportistaRepository();
  const envios = new InMemoryEnvioRepository();
  const vehiculos = new InMemoryVehiculoRepository();
  const uow = new InMemoryUnitOfWork();
  return {
    transportistas,
    envios,
    vehiculos,
    uow,
    aceptar: new AceptarEnvioUseCase(transportistas, envios, uow),
    cambiarEstado: new ActualizarEstadoEnvioUseCase(transportistas, envios, uow),
    actualizarUbicacion: new ActualizarUbicacionUseCase(transportistas, envios),
    actualizarDisponibilidad: new ActualizarDisponibilidadUseCase(transportistas),
    registrarVehiculo: new RegistrarVehiculoUseCase(vehiculos),
    actualizarVehiculo: new ActualizarVehiculoUseCase(vehiculos),
    explorarEnvios: new ExplorarEnviosUseCase(transportistas, envios),
  };
}

describe("AceptarEnvioUseCase (application)", () => {
  it("flujo feliz: transportista DISPONIBLE pasa a OCUPADO y envío a ACEPTADO", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase());
    t.envios.cargar(envioBase());

    const r = await t.aceptar.ejecutar({
      transportistaDni: "28987654",
      envioId: 1040,
      posicionTransportista: { lat: ORIGEN.lat, lng: ORIGEN.lng },
    });

    expect(r.estado).toBe("ACEPTADO");
    const t2 = await t.transportistas.obtenerPorDni("28987654");
    expect(t2?.estado).toBe("OCUPADO");
    const e2 = await t.envios.obtenerPorId(1040);
    expect(e2?.transportistaDni).toBe("28987654");
  });

  it("rechaza si ya tiene envío en tránsito", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase());
    t.envios.cargar(envioBase({ id: 9001, estado: "ACEPTADO", transportistaDni: "28987654" }));
    t.envios.cargar(envioBase({ id: 9002 }));

    let lanzo = false;
    try {
      await t.aceptar.ejecutar({
        transportistaDni: "28987654",
        envioId: 9002,
        posicionTransportista: { lat: ORIGEN.lat, lng: ORIGEN.lng },
      });
    } catch (e) {
      lanzo = true;
      expect(e instanceof TransportistaOcupado).toBeTrue();
    }
    expect(lanzo).toBeTrue();
  });

  it("rechaza si MOTO intenta llevar paquete L", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase());
    t.envios.cargar(envioBase({ categoriaPaquete: "L" }));

    let lanzo = false;
    try {
      await t.aceptar.ejecutar({
        transportistaDni: "28987654",
        envioId: 1040,
        posicionTransportista: { lat: ORIGEN.lat, lng: ORIGEN.lng },
      });
    } catch (e) {
      lanzo = true;
      expect(e instanceof CapacidadInsuficiente).toBeTrue();
    }
    expect(lanzo).toBeTrue();
  });

  it("rechaza si el envío ya no está BUSCANDO", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase());
    t.envios.cargar(envioBase({ estado: "ACEPTADO" }));

    let lanzo = false;
    try {
      await t.aceptar.ejecutar({
        transportistaDni: "28987654",
        envioId: 1040,
        posicionTransportista: { lat: ORIGEN.lat, lng: ORIGEN.lng },
      });
    } catch (e) {
      lanzo = true;
      expect(e instanceof EnvioNoDisponible).toBeTrue();
    }
    expect(lanzo).toBeTrue();
  });
});

describe("ActualizarEstadoEnvioUseCase (application)", () => {
  it("ACEPTADO → RETIRADO con coords funciona", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase({ estado: "OCUPADO" }));
    t.envios.cargar(envioBase({ estado: "ACEPTADO", transportistaDni: "28987654" }));

    const r = await t.cambiarEstado.ejecutar({
      transportistaDni: "28987654",
      envioId: 1040,
      nuevoEstado: "RETIRADO",
      posicionTransportista: { lat: ORIGEN.lat, lng: ORIGEN.lng },
    });
    expect(r.estado).toBe("RETIRADO");
  });

  it("EN_CAMINO → ENTREGADO libera al transportista", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase({ estado: "OCUPADO" }));
    t.envios.cargar(envioBase({ estado: "EN_CAMINO", transportistaDni: "28987654" }));

    await t.cambiarEstado.ejecutar({
      transportistaDni: "28987654",
      envioId: 1040,
      nuevoEstado: "ENTREGADO",
      posicionTransportista: { lat: DESTINO.lat, lng: DESTINO.lng },
    });

    const final = await t.transportistas.obtenerPorDni("28987654");
    expect(final?.estado).toBe("DISPONIBLE");
  });

  it("requiere coords para marcar RETIRADO", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase({ estado: "OCUPADO" }));
    t.envios.cargar(envioBase({ estado: "ACEPTADO", transportistaDni: "28987654" }));

    let lanzo = false;
    try {
      await t.cambiarEstado.ejecutar({
        transportistaDni: "28987654",
        envioId: 1040,
        nuevoEstado: "RETIRADO",
        posicionTransportista: null,
      });
    } catch (e) {
      lanzo = true;
      expect(e instanceof CoordenadasFaltantes).toBeTrue();
    }
    expect(lanzo).toBeTrue();
  });
});

describe("ActualizarUbicacionUseCase (application)", () => {
  it("guarda la posición y detecta geofence EN_ORIGEN", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase({ estado: "OCUPADO" }));
    t.envios.cargar(envioBase({ estado: "ACEPTADO", transportistaDni: "28987654" }));

    const r = await t.actualizarUbicacion.ejecutar({
      dni: "28987654",
      posicion: { lat: ORIGEN.lat, lng: ORIGEN.lng },
    });
    expect(r.eventoGeofence).toBe("EN_ORIGEN");
    expect(r.codigoEnvio).toBe(1040);

    const ultima = await t.transportistas.obtenerUltimaUbicacion("28987654");
    expect(ultima?.lat).toBe(ORIGEN.lat);
    expect(ultima?.lng).toBe(ORIGEN.lng);
  });

  it("sin envío activo, devuelve eventoGeofence null", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase());

    const r = await t.actualizarUbicacion.ejecutar({
      dni: "28987654",
      posicion: { lat: ORIGEN.lat, lng: ORIGEN.lng },
    });
    expect(r.eventoGeofence).toBe(null);
    expect(r.codigoEnvio).toBe(null);
  });

  it("rechaza si está NO_DISPONIBLE", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase({ estado: "NO_DISPONIBLE" }));

    let lanzo = false;
    try {
      await t.actualizarUbicacion.ejecutar({
        dni: "28987654",
        posicion: { lat: ORIGEN.lat, lng: ORIGEN.lng },
      });
    } catch (e) {
      lanzo = true;
      expect(e instanceof TransportistaNoDisponible).toBeTrue();
    }
    expect(lanzo).toBeTrue();
  });
});

describe("ActualizarDisponibilidadUseCase (application)", () => {
  it("pasa de NO_DISPONIBLE a DISPONIBLE si tiene vehículo", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase({ estado: "NO_DISPONIBLE" }));
    const r = await t.actualizarDisponibilidad.ejecutar({ dni: "28987654", disponible: true });
    expect(r.estado).toBe("DISPONIBLE");
  });

  it("rechaza ponerse DISPONIBLE sin vehículo", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase({ estado: "NO_DISPONIBLE", vehiculo: null }));
    let lanzo = false;
    try {
      await t.actualizarDisponibilidad.ejecutar({ dni: "28987654", disponible: true });
    } catch (e) {
      lanzo = true;
      expect(e instanceof VehiculoNoRegistrado).toBeTrue();
    }
    expect(lanzo).toBeTrue();
  });
});

describe("RegistrarVehiculoUseCase (application)", () => {
  it("registra MOTO con patente válida", async () => {
    const t = armar();
    const v = await t.registrarVehiculo.ejecutar({
      dni: "28987654",
      vehiculo: { categoria: "MOTO", patente: "AB123CD" },
    });
    expect(v.categoria).toBe("MOTO");
    expect(v.patente).toBe("AB123CD");
  });

  it("registra BICI sin patente", async () => {
    const t = armar();
    const v = await t.registrarVehiculo.ejecutar({
      dni: "28987654",
      vehiculo: { categoria: "BICI", patente: null },
    });
    expect(v.categoria).toBe("BICI");
    expect(v.patente).toBe(null);
  });

  it("rechaza MOTO sin patente", async () => {
    const t = armar();
    let lanzo = false;
    try {
      await t.registrarVehiculo.ejecutar({
        dni: "28987654",
        vehiculo: { categoria: "MOTO", patente: null },
      });
    } catch (e) {
      lanzo = true;
      expect(e instanceof PatenteInvalida).toBeTrue();
    }
    expect(lanzo).toBeTrue();
  });

  it("rechaza si ya tiene vehículo", async () => {
    const t = armar();
    t.vehiculos.cargar("28987654", { id: 1, categoria: "MOTO", patente: "AB123CD" });
    let lanzo = false;
    try {
      await t.registrarVehiculo.ejecutar({
        dni: "28987654",
        vehiculo: { categoria: "AUTO", patente: "BC456EF" },
      });
    } catch (e) {
      lanzo = true;
      expect(e instanceof VehiculoYaRegistrado).toBeTrue();
    }
    expect(lanzo).toBeTrue();
  });

  it("rechaza patente ya usada por otro transportista", async () => {
    const t = armar();
    t.vehiculos.cargar("11111111", { id: 1, categoria: "MOTO", patente: "AB123CD" });
    let lanzo = false;
    try {
      await t.registrarVehiculo.ejecutar({
        dni: "28987654",
        vehiculo: { categoria: "AUTO", patente: "AB123CD" },
      });
    } catch (e) {
      lanzo = true;
      expect(e instanceof PatenteInvalida).toBeTrue();
    }
    expect(lanzo).toBeTrue();
  });
});

describe("ActualizarVehiculoUseCase (application)", () => {
  it("permite cambiar categoría y patente del propio vehículo", async () => {
    const t = armar();
    t.vehiculos.cargar("28987654", { id: 1, categoria: "MOTO", patente: "AB123CD" });
    const v = await t.actualizarVehiculo.ejecutar({
      dni: "28987654",
      vehiculo: { categoria: "AUTO", patente: "CD456EF" },
    });
    expect(v.categoria).toBe("AUTO");
    expect(v.patente).toBe("CD456EF");
  });

  it("rechaza si no tiene vehículo registrado", async () => {
    const t = armar();
    let lanzo = false;
    try {
      await t.actualizarVehiculo.ejecutar({
        dni: "28987654",
        vehiculo: { categoria: "AUTO", patente: "CD456EF" },
      });
    } catch (e) {
      lanzo = true;
      expect(e instanceof VehiculoNoRegistrado).toBeTrue();
    }
    expect(lanzo).toBeTrue();
  });
});

describe("ExplorarEnviosUseCase (application)", () => {
  it("filtra por radio y por capacidad del vehículo", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase()); // MOTO admite S, M

    t.envios.cargar(envioBase({ id: 1, categoriaPaquete: "S" }));
    t.envios.cargar(envioBase({ id: 2, categoriaPaquete: "M" }));
    t.envios.cargar(envioBase({ id: 3, categoriaPaquete: "L" }));

    const r = await t.explorarEnvios.ejecutar({
      dni: "28987654",
      posicion: { lat: ORIGEN.lat, lng: ORIGEN.lng },
      radioKm: 5,
    });
    const ids = r.map((e) => e.id).sort((a, b) => a - b);
    expect(ids).toEqual([1, 2]);
  });

  it("excluye envíos fuera del radio", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase());

    t.envios.cargar(envioBase({ id: 1 }));
    t.envios.cargar(
      envioBase({
        id: 2,
        origen: { lat: -34.6, lng: -58.4, direccion: "Buenos Aires" },
      })
    );

    const r = await t.explorarEnvios.ejecutar({
      dni: "28987654",
      posicion: { lat: ORIGEN.lat, lng: ORIGEN.lng },
      radioKm: 5,
    });
    expect(r.map((e) => e.id)).toEqual([1]);
  });

  it("rechaza si el transportista no está DISPONIBLE", async () => {
    const t = armar();
    t.transportistas.cargar(transportistaBase({ estado: "OCUPADO" }));

    let lanzo = false;
    try {
      await t.explorarEnvios.ejecutar({
        dni: "28987654",
        posicion: { lat: ORIGEN.lat, lng: ORIGEN.lng },
      });
    } catch (e) {
      lanzo = true;
      expect(e instanceof TransportistaNoDisponible).toBeTrue();
    }
    expect(lanzo).toBeTrue();
  });
});

const _silencio: Vehiculo[] = [];
void _silencio;
