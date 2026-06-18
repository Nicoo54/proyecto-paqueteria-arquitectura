export interface Reloj {
  ahora(): Date;
}

export class RelojSistema implements Reloj {
  ahora(): Date {
    return new Date();
  }
}
