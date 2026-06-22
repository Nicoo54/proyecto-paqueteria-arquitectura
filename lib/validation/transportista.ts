import { z } from "zod";
import { CATEGORIAS_VEHICULO } from "../domain/vehiculo/types";
import { LatSchema, LngSchema, PaginacionSchema } from "./comunes";

export const ActualizarUbicacionSchema = z.object({
  lat: LatSchema,
  lng: LngSchema,
});
export type ActualizarUbicacionInput = z.infer<
  typeof ActualizarUbicacionSchema
>;

export const ActualizarDisponibilidadSchema = z.object({
  disponible: z.boolean(),
});
export type ActualizarDisponibilidadInput = z.infer<
  typeof ActualizarDisponibilidadSchema
>;

export const VehiculoRequestSchema = z
  .object({
    categoria: z.enum(CATEGORIAS_VEHICULO),
    patente: z.string().trim().min(1).max(10).nullable().optional(),
  })
  .transform((v) => ({ categoria: v.categoria, patente: v.patente ?? null }));
export type VehiculoRequestInput = z.infer<typeof VehiculoRequestSchema>;

export const RegistrarVehiculoSchema = VehiculoRequestSchema;
export const ActualizarVehiculoSchema = VehiculoRequestSchema;

export const HistorialEnviosQuerySchema = PaginacionSchema;

export const ExplorarEnviosQuerySchema = z.object({
  lat: z.coerce.number().pipe(LatSchema),
  lng: z.coerce.number().pipe(LngSchema),
  radioKm: z.coerce.number().int().min(1).max(50).default(5),
});
export type ExplorarEnviosQueryInput = z.infer<
  typeof ExplorarEnviosQuerySchema
>;
