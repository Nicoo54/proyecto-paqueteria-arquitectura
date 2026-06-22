import { MercadoPagoConfig, Preference } from "mercadopago";

const accessToken = process.env.MP_ACCESS_TOKEN;
if (!accessToken) {
  console.warn(
    "⚠️ ALERTA: MP_ACCESS_TOKEN no está definido en el archivo .env",
  );
}

const client = new MercadoPagoConfig({
  accessToken: accessToken || "TEST-dummy-token",
  options: {
    timeout: 10000,
  },
});

export class MercadoPagoError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 503) {
    super(message);
    this.statusCode = statusCode;
    this.name = "MercadoPagoError";
  }
}

export const createPaymentPreference = async (
  title: string,
  price: number,
  quantity: number = 1,
) => {
  try {
    const preference = new Preference(client);

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const esLocal = baseUrl.includes("localhost");

    const result = await preference.create({
      body: {
        items: [
          {
            id: "envio",
            title: title,
            quantity: quantity,
            unit_price: price,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: `${baseUrl}/cliente`,
          failure: `${baseUrl}/cliente/cotizar`,
          pending: `${baseUrl}/cliente`,
        },
        ...(!esLocal && { auto_return: "approved" }),
      },
    });

    return result;
  } catch (error) {
    throw new MercadoPagoError(
      "Pasarela de pagos no disponible temporalmente",
      503,
    );
  }
};
