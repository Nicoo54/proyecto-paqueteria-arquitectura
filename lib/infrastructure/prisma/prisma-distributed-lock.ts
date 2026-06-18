import type { PrismaClient } from "@prisma/client";
import type {
  DistributedLock,
  ResultadoConLock,
} from "../../application/ports/distributed-lock";

function hashFNV1a(input: string): bigint {
  let hash = BigInt("0xcbf29ce484222325");
  const prime = BigInt("0x100000001b3");
  const mask = BigInt("0xffffffffffffffff");
  const positiveMask = BigInt("0x7fffffffffffffff");
  for (let i = 0; i < input.length; i++) {
    hash = (hash ^ BigInt(input.charCodeAt(i))) & mask;
    hash = (hash * prime) & mask;
  }
  return hash & positiveMask;
}

export class PrismaDistributedLock implements DistributedLock {
  constructor(private readonly prisma: PrismaClient) {}

  async conLock<T>(clave: string, fn: () => Promise<T>): Promise<ResultadoConLock<T>> {
    const id = hashFNV1a(clave);
    const adquirido = await this.tryLock(id);
    if (!adquirido) return { adquirido: false };
    try {
      const resultado = await fn();
      return { adquirido: true, resultado };
    } finally {
      await this.unlock(id);
    }
  }

  private async tryLock(id: bigint): Promise<boolean> {
    const filas = await this.prisma.$queryRaw<{ pg_try_advisory_lock: boolean }[]>`
      SELECT pg_try_advisory_lock(${id}::bigint)
    `;
    return filas[0]?.pg_try_advisory_lock === true;
  }

  private async unlock(id: bigint): Promise<void> {
    await this.prisma.$queryRaw`
      SELECT pg_advisory_unlock(${id}::bigint)
    `;
  }
}
