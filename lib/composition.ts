import { ClerkAuthenticator } from "./infrastructure/clerk/clerk-authenticator";
import {
  prisma,
  PrismaDistributedLock,
  PrismaEnvioRepository,
  PrismaTransaccionRepository,
  PrismaTransportistaRepository,
  PrismaUnitOfWork,
  PrismaUsuarioRepository,
  PrismaVehiculoRepository,
} from "./infrastructure/prisma";
import { FakePasarelaDePagos } from "./infrastructure/pasarela";
import { RelojSistema } from "./application/ports/reloj";
import {
  AceptarEnvioUseCase,
  ActualizarDisponibilidadUseCase,
  ActualizarEstadoEnvioUseCase,
  ActualizarUbicacionUseCase,
  ActualizarVehiculoUseCase,
  ExplorarEnviosUseCase,
  RegistrarVehiculoUseCase,
} from "./application/use-cases/transportista";
import { LiquidarPagosNocturnaUseCase } from "./application/use-cases/liquidacion";

export function crearDependenciasTransportista() {
  const transportistas = new PrismaTransportistaRepository(prisma);
  const vehiculos = new PrismaVehiculoRepository(prisma);
  const envios = new PrismaEnvioRepository(prisma);
  const transacciones = new PrismaTransaccionRepository(prisma);
  const usuarios = new PrismaUsuarioRepository(prisma);
  const uow = new PrismaUnitOfWork(prisma);
  const authenticator = new ClerkAuthenticator();
  const lock = new PrismaDistributedLock(prisma);
  const reloj = new RelojSistema();
  const pasarela = new FakePasarelaDePagos();

  return {
    repositorios: { transportistas, vehiculos, envios, transacciones, usuarios },
    ports: { authenticator, lock, reloj, uow, pasarela },
    casosDeUso: {
      aceptarEnvio: new AceptarEnvioUseCase(transportistas, envios, uow),
      actualizarDisponibilidad: new ActualizarDisponibilidadUseCase(transportistas),
      actualizarEstadoEnvio: new ActualizarEstadoEnvioUseCase(transportistas, envios, uow),
      actualizarUbicacion: new ActualizarUbicacionUseCase(transportistas, envios),
      actualizarVehiculo: new ActualizarVehiculoUseCase(vehiculos),
      explorarEnvios: new ExplorarEnviosUseCase(transportistas, envios),
      registrarVehiculo: new RegistrarVehiculoUseCase(vehiculos),
      liquidarPagosNocturna: new LiquidarPagosNocturnaUseCase({
        transacciones,
        pasarela,
        lock,
        uow,
        reloj,
      }),
    },
  };
}

export type DependenciasTransportista = ReturnType<typeof crearDependenciasTransportista>;
