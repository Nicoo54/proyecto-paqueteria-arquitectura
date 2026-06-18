export interface UnitOfWork {
  ejecutar<T>(fn: (tx: TxScope) => Promise<T>): Promise<T>;
}

export type TxScope = unknown;
