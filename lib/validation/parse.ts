import type { z } from "zod";
import { errorHttp, type HttpErrorResponse } from "../http/errors";

export type ResultadoParse<T> =
  | { ok: true; valor: T }
  | { ok: false; error: HttpErrorResponse };

export function parseConSchema<S extends z.ZodTypeAny>(
  schema: S,
  raw: unknown
): ResultadoParse<z.infer<S>> {
  const r = schema.safeParse(raw);
  if (r.success) return { ok: true, valor: r.data };
  const issues = r.error.issues.map((i) => ({
    path: i.path.join("."),
    message: i.message,
    code: i.code,
  }));
  return {
    ok: false,
    error: errorHttp("VALIDACION_FALLIDA", "Los datos enviados no son válidos", 400, { issues }),
  };
}
