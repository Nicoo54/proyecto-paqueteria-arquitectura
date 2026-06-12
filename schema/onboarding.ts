import { z } from "zod";

const patenteRegex = /^(?:[A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$/;

export const PatenteSchema = z.object({
  patente: z
    .string()
    .min(1, "La patente es obligatoria")
    .transform((val) => val.toUpperCase().replace(/\s+/g, ""))
    .refine((val) => patenteRegex.test(val), {
      message: "Formato de patente inválido. Debe ser AAA123 o AA123AA",
    }),
});

export const DniSchema = z.object({
  dni: z
    .string()
    .min(1, "El DNI es obligatorio")
    .trim()
    .refine((val) => /^[0-9]{7,8}$/.test(val), {
      message: "El DNI debe contener solo números (entre 7 y 8 dígitos)",
    }),
});
