import type { PrismaClient } from "@prisma/client";
import type { UnitOfWork } from "../../application/repositories/unit-of-work";

export class PrismaUnitOfWork implements UnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  async ejecutar<T>(fn: (tx: unknown) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx: any) => fn(tx));
  }
}
