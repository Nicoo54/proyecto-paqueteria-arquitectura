import type { UnitOfWork } from "../repositories";

export class InMemoryUnitOfWork implements UnitOfWork {
  async ejecutar<T>(fn: (tx: unknown) => Promise<T>): Promise<T> {
    return fn(null);
  }
}
