import { z } from "zod";

export const LatSchema = z.number().min(-90).max(90).finite();
export const LngSchema = z.number().min(-180).max(180).finite();

export const CoordenadaSchema = z.object({
  lat: LatSchema,
  lng: LngSchema,
});

export const EnvioIdSchema = z.coerce.number().int().positive();

export const PaginacionSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginacionInput = z.infer<typeof PaginacionSchema>;
