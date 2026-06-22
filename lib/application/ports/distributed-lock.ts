export type LockNoAdquirido = { adquirido: false };
export type LockAdquirido<T> = { adquirido: true; resultado: T };
export type ResultadoConLock<T> = LockAdquirido<T> | LockNoAdquirido;

export interface DistributedLock {
  conLock<T>(clave: string, fn: () => Promise<T>): Promise<ResultadoConLock<T>>;
}
