import { z } from "zod";

export const AceptarEnvioSchema = z.object({
  estado: z.literal("ACEPTADO"),
});
export type AceptarEnvioInput = z.infer<typeof AceptarEnvioSchema>;

export const CambiarEstadoEnvioSchema = z.object({
  estado: z.enum(["RETIRADO", "EN_CAMINO", "ENTREGADO"]),
});
export type CambiarEstadoEnvioInput = z.infer<typeof CambiarEstadoEnvioSchema>;
