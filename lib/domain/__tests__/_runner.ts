export const describe = global.describe;
export const it = global.it;
export const test = global.test;

export function expect<T>(actual: T) {
  const e = global.expect(actual);
  return {
    toBe(esperado: T): void {
      e.toBe(esperado);
    },
    toEqual(esperado: unknown): void {
      e.toEqual(esperado);
    },
    toBeTrue(): void {
      e.toBe(true);
    },
    toBeFalse(): void {
      e.toBe(false);
    },
    toBeCloseTo(esperado: number, tolerancia = 0.5): void {
      if (Math.abs((actual as number) - esperado) > tolerancia) {
        throw new Error(`Esperaba ~${esperado} (±${tolerancia}) pero recibí ${actual}`);
      }
    },
    toThrow(claseEsperada?: new (...args: never[]) => Error): void {
      if (claseEsperada) {
        e.toThrow(claseEsperada);
      } else {
        e.toThrow();
      }
    },
  };
}

export async function correrTests(): Promise<void> {
  // Jest corre los tests automáticamente, no necesitamos hacer nada.
}
