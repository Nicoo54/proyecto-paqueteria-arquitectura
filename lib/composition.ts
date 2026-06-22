import { ClerkAuthenticator } from "./infrastructure/clerk/clerk-authenticator";
import {
  prisma,
  PrismaDistributedLock,
  PrismaEnvioRepository,
  PrismaMetricaRepository,
  PrismaTransaccionRepository,
  PrismaTransportistaRepository,
  PrismaUnitOfWork,
  PrismaUsuarioRepository,
  PrismaVehiculoRepository,
  PrismaZonaCalienteRepository,
} from "./infrastructure/prisma";
import { MercadoPagoPasarela } from "./infrastructure/pasarela";
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
import { CalcularAnaliticaNocturnaUseCase } from "./application/use-cases/analitica";

export function crearDependenciasTransportista() {
  const transportistas = new PrismaTransportistaRepository(prisma);
  const vehiculos = new PrismaVehiculoRepository(prisma);
  const envios = new PrismaEnvioRepository(prisma);
  const transacciones = new PrismaTransaccionRepository(prisma);
  const usuarios = new PrismaUsuarioRepository(prisma);
  const zonasCalientes = new PrismaZonaCalienteRepository(prisma);
  const metricas = new PrismaMetricaRepository(prisma);
  const uow = new PrismaUnitOfWork(prisma);
  const authenticator = new ClerkAuthenticator();
  const lock = new PrismaDistributedLock(prisma);
  const reloj = new RelojSistema();
  const pasarela = new MercadoPagoPasarela();

  return {
    repositorios: {
      transportistas,
      vehiculos,
      envios,
      transacciones,
      usuarios,
      zonasCalientes,
      metricas,
    },
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
      calcularAnaliticaNocturna: new CalcularAnaliticaNocturnaUseCase({
        envios,
        zonas: zonasCalientes,
        metricas,
        lock,
        reloj,
      }),
    },
  };
}

export type DependenciasTransportista = ReturnType<typeof crearDependenciasTransportista>;
