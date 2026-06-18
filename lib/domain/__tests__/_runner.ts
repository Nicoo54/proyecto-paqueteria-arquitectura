type Caso = { nombre: string; ejecutar: () => void | Promise<void> };
const casos: Caso[] = [];

export function describe(nombre: string, fn: () => void): void {
  const prefijoAnterior = describeStack[describeStack.length - 1] ?? "";
  describeStack.push(prefijoAnterior ? `${prefijoAnterior} > ${nombre}` : nombre);
  try {
    fn();
  } finally {
    describeStack.pop();
  }
}

const describeStack: string[] = [];

export function it(nombre: string, fn: () => void | Promise<void>): void {
  const prefijo = describeStack[describeStack.length - 1] ?? "";
  casos.push({ nombre: prefijo ? `${prefijo} > ${nombre}` : nombre, ejecutar: fn });
}

export const test = it;

export function expect<T>(actual: T) {
  return {
    toBe(esperado: T): void {
      if (!Object.is(actual, esperado)) {
        throw new Error(`Esperaba ${JSON.stringify(esperado)} pero recibí ${JSON.stringify(actual)}`);
      }
    },
    toEqual(esperado: unknown): void {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(esperado);
      if (a !== b) {
        throw new Error(`Esperaba ${b} pero recibí ${a}`);
      }
    },
    toBeTrue(): void {
      if (actual !== true) throw new Error(`Esperaba true pero recibí ${JSON.stringify(actual)}`);
    },
    toBeFalse(): void {
      if (actual !== false) throw new Error(`Esperaba false pero recibí ${JSON.stringify(actual)}`);
    },
    toBeCloseTo(esperado: number, tolerancia = 0.5): void {
      if (typeof actual !== "number") {
        throw new Error(`Esperaba un número pero recibí ${typeof actual}`);
      }
      if (Math.abs(actual - esperado) > tolerancia) {
        throw new Error(`Esperaba ~${esperado} (±${tolerancia}) pero recibí ${actual}`);
      }
    },
    toThrow(claseEsperada?: new (...args: never[]) => Error): void {
      if (typeof actual !== "function") {
        throw new Error("Esperaba una función para chequear excepción");
      }
      let lanzo = false;
      let error: unknown = null;
      try {
        (actual as () => unknown)();
      } catch (e) {
        lanzo = true;
        error = e;
      }
      if (!lanzo) throw new Error("Se esperaba que lanzara una excepción");
      if (claseEsperada && !(error instanceof claseEsperada)) {
        throw new Error(
          `Se esperaba excepción ${claseEsperada.name} pero se lanzó ${(error as Error)?.constructor?.name}`
        );
      }
    },
  };
}

export async function correrTests(): Promise<void> {
  let pasados = 0;
  let fallados = 0;
  for (const caso of casos) {
    try {
      await caso.ejecutar();
      console.log(`  ✓ ${caso.nombre}`);
      pasados++;
    } catch (e) {
      console.error(`  ✗ ${caso.nombre}`);
      console.error(`    ${(e as Error).message}`);
      fallados++;
    }
  }
  console.log(`\n${pasados} pasados, ${fallados} fallados, ${casos.length} total`);
  if (fallados > 0) {
    process.exitCode = 1;
  }
}
