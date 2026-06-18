import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuración de MercadoPago
// El token debe ser un token de prueba (TEST-...) según requerimientos
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-dummy-token',
  options: {
    timeout: 5000 // Configuración nativa del SDK si está disponible
  }
});

export class MercadoPagoError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 503) {
    super(message);
    this.statusCode = statusCode;
    this.name = "MercadoPagoError";
  }
}

/**
 * Crea una preferencia de pago.
 * Implementa timeout estricto de 5 segundos. 
 * Si falla o supera el tiempo, lanza un error 503 según el ADR de resiliencia.
 */
export const createPaymentPreference = async (
  title: string,
  price: number,
  quantity: number = 1
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const preference = new Preference(client);
    
    const createPromise = preference.create({
      body: {
        items: [
          {
            id: 'envio',
            title: title,
            quantity: quantity,
            unit_price: price,
            currency_id: 'ARS',
          }
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/envios/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/envios/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/envios/pending`,
        },
        auto_return: "approved",
      }
    });

    // Implementamos Promise.race para asegurar el timeout estricto
    const result = await Promise.race([
      createPromise,
      new Promise<any>((_, reject) => {
        if (controller.signal.aborted) {
          return reject(new Error('Timeout'));
        }
        controller.signal.addEventListener('abort', () => reject(new Error('Timeout')));
      })
    ]);

    clearTimeout(timeoutId);
    return result;

  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Error al comunicarse con MercadoPago:", error);
    // Lanzar un 503 para abortar la petición y que el controlador retorne un 503 HTTP (según ADR)
    throw new MercadoPagoError("Pasarela de pagos no disponible temporalmente", 503);
  }
};
