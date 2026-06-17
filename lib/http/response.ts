import { NextResponse } from "next/server";
import { errorDesconocidoAHttp } from "./errors";

export function jsonOk<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function jsonError(error: unknown): NextResponse {
  const { status, body } = errorDesconocidoAHttp(error);
  return NextResponse.json(body, { status });
}
