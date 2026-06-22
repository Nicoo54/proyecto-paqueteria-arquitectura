// Nota de coordinación: este archivo lo va a aportar también el
// dueño de Remitente con un POST /envios (publicar). Cuando se mergee,
// ambos handlers (GET y POST) conviven en este archivo.
import { NextRequest, NextResponse } from "next/server";
import { ExplorarEnviosQuerySchema } from "@/lib/validation/transportista";
import { parseConSchema } from "@/lib/validation/parse";
import { contextoTransportista, queryParams } from "@/lib/http/handler-utils";
import { jsonError, jsonOk } from "@/lib/http/response";
import { envioADto } from "@/lib/http/dto/envio";
import { CategoriaValida, TipoPagoValido } from "../../../lib/tipos";
import { ResponseEnvio } from "../../../lib/responses";
import { prisma } from "../../../lib/prisma";
import { ObtenerCondicionClimatica } from "../../../lib/condicion-climatica";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { deps, ctx } = await contextoTransportista();
    const parse = parseConSchema(ExplorarEnviosQuerySchema, queryParams(req));
    if (!parse.ok) {
      return jsonOk(parse.error.body, parse.error.status);
    }
    const envios = await deps.casosDeUso.explorarEnvios.ejecutar({
      dni: ctx.dni,
      posicion: { lat: parse.valor.lat, lng: parse.valor.lng },
      radioKm: parse.valor.radioKm,
    });
    return jsonOk(envios.map(envioADto));
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      origenDireccion,
      origenLat,
      origenLng,
      destinoDireccion,
      destinoLat,
      destinoLng,
      categoriaPaquete,
      precioCalculado,
      tipoPago,
    } = body;

    // Este token no lo usan para nada pero no lo quito
    // para no romper cosas imprevistas... revisar.
    const metodoPagoToken = process.env.MP_ACCESS_TOKEN;

    if (origenDireccion === undefined) {
      return NextResponse.json(
        { error: "No se especifica direccion de origen" },
        { status: 400 },
      );
    }

    if (origenLat === undefined) {
      return NextResponse.json(
        { error: "No se especifica latitud de origen" },
        { status: 400 },
      );
    }

    if (origenLng === undefined) {
      return NextResponse.json(
        { error: "No se especifica longitud de origen" },
        { status: 400 },
      );
    }

    if (destinoDireccion === undefined) {
      return NextResponse.json(
        { error: "No se especifica direccion de destino" },
        { status: 400 },
      );
    }

    if (destinoLat === undefined) {
      return NextResponse.json(
        { error: "No se especifica latitud de destino" },
        { status: 400 },
      );
    }

    if (destinoLng === undefined) {
      return NextResponse.json(
        { error: "No se especifica longitud de destino" },
        { status: 400 },
      );
    }

    if (categoriaPaquete === undefined) {
      return NextResponse.json(
        { error: "No se especifica categoria del paquete" },
        { status: 400 },
      );
    }

    if (precioCalculado === undefined) {
      return NextResponse.json(
        { error: "No se especifica precio del paquete" },
        { status: 400 },
      );
    }

    if (tipoPago === undefined) {
      return NextResponse.json(
        { error: "No se especifica tipo de pago" },
        { status: 400 },
      );
    }

    if (typeof origenDireccion !== "string") {
      return NextResponse.json(
        { error: "Direccion de origen invalida" },
        { status: 400 },
      );
    }

    if (typeof destinoDireccion !== "string") {
      return NextResponse.json(
        { error: "Direccion de destino invalida" },
        { status: 400 },
      );
    }

    if (Number.isNaN(Number.parseFloat(origenLat))) {
      return NextResponse.json(
        { error: "Latitud de origen invalida" },
        { status: 400 },
      );
    }

    if (Number.isNaN(Number.parseFloat(origenLng))) {
      return NextResponse.json(
        { error: "Longitud de origen invalida" },
        { status: 400 },
      );
    }

    if (Number.isNaN(Number.parseFloat(destinoLat))) {
      return NextResponse.json(
        { error: "Latitud de destino invalida" },
        { status: 400 },
      );
    }

    if (Number.isNaN(Number.parseFloat(destinoLng))) {
      return NextResponse.json(
        { error: "Longitud de destino invalida" },
        { status: 400 },
      );
    }

    if (Number.isNaN(Number.parseFloat(precioCalculado))) {
      return NextResponse.json({ error: "Precio invalido" }, { status: 400 });
    }

    if (!CategoriaValida(categoriaPaquete)) {
      return NextResponse.json(
        { error: "Categoria de paquete invalida" },
        { status: 400 },
      );
    }

    if (!TipoPagoValido(tipoPago)) {
      return NextResponse.json(
        { error: "Tipo de pago invalido" },
        { status: 400 },
      );
    }

    if (tipoPago === "DIGITAL" && !metodoPagoToken) {
      return NextResponse.json(
        { error: "El token de pago es requerido para pagos digitales" },
        { status: 400 },
      );
    }

    // TODO: comparar precioCalculado con lo cacheado en redis
    //       y devolver el error de cotizacion expirada.

    const remitente = await prisma.usuario.findUnique({
      where: { clerkId: userId },
    });

    if (remitente === null) {
      return NextResponse.json(
        { error: "No se encontro el usuario" },
        { status: 404 },
      );
    }

    const remitenteDNI = remitente.dni;
    const condicion = await ObtenerCondicionClimatica({
      direccion: origenDireccion,
      latitud: origenLat,
      longitud: origenLng,
    });

    // Esto esta mal, crea la orden antes de pagar. MP al procesar el pago deberia
    // llamar a otro endpoint para confirmar el pago y ahi crear la orden.
    const envio = await prisma.envio.create({
      data: {
        categoriaPaquete: categoriaPaquete,
        remitenteDni: remitenteDNI,
        origenDireccion: origenDireccion,
        origenLat: origenLat,
        origenLng: origenLng,
        destinoDireccion: destinoDireccion,
        destinoLat: destinoLat,
        destinoLng: destinoLng,
        condicionClimatica: condicion,
        estado: "BUSCANDO",
        costo: precioCalculado,
        tipoPago: tipoPago,
      },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : req.nextUrl.origin);

    const response = await fetch(`${baseUrl}/api/envios/${envio.id}/pagos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
        Authorization: req.headers.get("authorization") || "",
      },
      body: JSON.stringify({ metodoPagoToken, precioCalculado }),
    });

    const textResponse = await response.text();
    let data;
    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      return NextResponse.json({ error: "Fallo interno" }, { status: 500 });
    }

    if (!response.ok || (data.status && data.status !== 201)) {
      return NextResponse.json(
        { error: data.error || "Error al crear pago" },
        { status: response.status || 400 },
      );
    }

    const paymentLink = data.paymentLink;

    return NextResponse.json(
      { ...ResponseEnvio(envio), paymentLink },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
