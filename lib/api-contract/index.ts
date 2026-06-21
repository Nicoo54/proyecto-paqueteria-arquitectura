// Contrato de la API REST del módulo Transportista.
// La UI debe importar estos tipos para sus services en lugar de
// duplicarlos. Resuelve la inconsistencia snake_case vs camelCase
// (todo va camelCase, coincide con el openapi.yaml).
//
// Uso desde la UI (ej. features/transportista/services/perfilService.ts):
//
//   import type { TransportistaDto, ActualizarUbicacionRequest }
//     from "@/lib/api-contract";
//
//   export async function obtenerPerfil(): Promise<TransportistaDto> {
//     const r = await fetch("/api/transportistas/me");
//     return r.json();
//   }

export type {
  TransportistaDto,
  ActualizarDisponibilidadRequestDto as ActualizarDisponibilidadRequest,
  ActualizarUbicacionRequestDto as ActualizarUbicacionRequest,
} from "../http/dto/transportista";

export type {
  VehiculoDto,
  VehiculoRequestDto as VehiculoRequest,
} from "../http/dto/vehiculo";

export type {
  EnvioDto,
  AceptarEnvioRequestDto as AceptarEnvioRequest,
  CambiarEstadoEnvioRequestDto as CambiarEstadoEnvioRequest,
  ExplorarEnviosQueryDto as ExplorarEnviosQuery,
} from "../http/dto/envio";

export type {
  PaginationDto as Pagination,
  PaginatedResponseDto as PaginatedResponse,
} from "../http/dto/pagination";

export type { ErrorBody } from "../http/errors";

export type { EstadoEnvio, CondicionClimatica } from "../domain/envio/types";

export type { EstadoTransportista } from "../domain/transportista/types";

export type {
  CategoriaVehiculo,
  CategoriaPaquete,
} from "../domain/vehiculo/types";

export type { EstadoPago } from "../domain/liquidacion/types";

// Endpoints disponibles, como referencia para la UI.
export const API_ENDPOINTS = {
  TRANSPORTISTA: {
    PERFIL: "/api/transportistas/me",
    DISPONIBILIDAD: "/api/transportistas/me/disponibilidad",
    UBICACION: "/api/transportistas/me/ubicacion",
    HISTORIAL: "/api/transportistas/me/envios",
    VEHICULO: "/api/transportistas/me/vehiculos",
    VIAJE_ACTIVO: "/api/transportistas/me/envios/viaje-activo",
    DETALLES_VIAJE_ACTIVO: (id: number | string) =>
      `/api/transportistas/me/envios/viaje-activo/${id}`,
  },
  ENVIOS: {
    EXPLORAR: "/api/envios",
    DETALLE: (id: number | string) => `/api/envios/${id}`,
    CAMBIAR_ESTADO: (id: number | string) => `/api/envios/${id}/estado`,
    TRACKING: (id: number | string) => `/api/envios/${id}/tracking`,
  },
  JOBS: {
    LIQUIDACION: "/api/jobs/liquidacion",
  },
} as const;
