// Singleton del cliente Prisma. Evita crear conexiones múltiples en dev
// (hot reload) y cumple con la recomendación oficial para Next.js.
//
// Requiere @prisma/client instalado y `npx prisma generate` ejecutado.

import { PrismaClient } from "@prisma/client";

declare global {
  var __prismaInstance__: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.__prismaInstance__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prismaInstance__ = prisma;
}

export type PrismaTransaccional = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];
