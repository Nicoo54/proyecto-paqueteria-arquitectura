import type { DistributedLock, ResultadoConLock } from "../ports/distributed-lock";

export class InMemoryDistributedLock implements DistributedLock {
  private readonly tomados = new Set<string>();

  async conLock<T>(clave: string, fn: () => Promise<T>): Promise<ResultadoConLock<T>> {
    if (this.tomados.has(clave)) {
      return { adquirido: false };
    }
    this.tomados.add(clave);
    try {
      const resultado = await fn();
      return { adquirido: true, resultado };
    } finally {
      this.tomados.delete(clave);
    }
  }

  forzarTomado(clave: string): void {
    this.tomados.add(clave);
  }
}
