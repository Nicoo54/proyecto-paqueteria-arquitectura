// FakePasarelaDePagos
//
// VERSIÓN PARA DEMO ACADÉMICA: siempre responde EXITOSA con un id
// sintético derivado del idempotencyKey. Permite mostrar el flujo
// completo de liquidación en el video sin depender de credenciales
// reales de transferencias bancarias.
//
// ──────────────────────────────────────────────────────────────────
// VERSIÓN REAL DE PRODUCCIÓN — referencia documentada
// ──────────────────────────────────────────────────────────────────
//
// En producción esta clase se reemplazaría por una integración con
// MercadoPago Money Out / Disbursements (API distinta a la de
// preferencias de pago: ésta envía dinero al destinatario, no recibe
// del cliente). Esquema del adapter real:
//
//   import { MercadoPagoConfig, MoneyOut } from "mercadopago";
//
//   const client = new MercadoPagoConfig({
//     accessToken: process.env.MP_ACCESS_TOKEN!,
//   });
//
//   export class MercadoPagoPasarela implements PasarelaDePagos {
//     async transferir(req: SolicitudTransferencia): Promise<ResultadoTransferencia> {
//       try {
//         const out = new MoneyOut(client);
//         const r = await out.create({
//           body: {
//             amount: req.monto,
//             currency_id: "ARS",
//             external_reference: req.idempotencyKey, // idempotency key
//             collector: { alias: req.aliasDestino },
//             description: req.descripcion,
//           },
//         });
//         if (r.status === "approved") {
//           return { tipo: "EXITOSA", idTransferenciaExterna: r.id };
//         }
//         if (r.status === "rejected") {
//           return { tipo: "RECHAZADA", motivo: r.status_detail ?? "rechazada" };
//         }
//         return { tipo: "ERROR_TEMPORAL", mensaje: `estado intermedio: ${r.status}` };
//       } catch (e) {
//         return { tipo: "ERROR_TEMPORAL", mensaje: (e as Error).message };
//       }
//     }
//   }
//
// Para esta demo NO usamos la versión real porque:
//   1. El sandbox de Money Out exige cuentas vendedoras verificadas.
//   2. La transferencia real no es el foco de la presentación.
//   3. El patrón arquitectónico (puerto + adapter + idempotencia +
//      reintentos + máquina de estados) se demuestra igual con el fake.

import type {
  PasarelaDePagos,
  ResultadoTransferencia,
  SolicitudTransferencia,
} from "../../application/ports/pasarela-pagos";

export class FakePasarelaDePagos implements PasarelaDePagos {
  async transferir(solicitud: SolicitudTransferencia): Promise<ResultadoTransferencia> {
    return {
      tipo: "EXITOSA",
      idTransferenciaExterna: `FAKE-${solicitud.idempotencyKey}`,
    };
  }
}
