import type { Reloj } from "../ports/reloj";

export class RelojFake implements Reloj {
  private actual: Date;

  constructor(inicial: Date = new Date("2026-06-10T03:00:00Z")) {
    this.actual = inicial;
  }

  ahora(): Date {
    return new Date(this.actual);
  }

  fijar(fecha: Date): void {
    this.actual = fecha;
  }

  avanzar(ms: number): void {
    this.actual = new Date(this.actual.getTime() + ms);
  }
}
