import { NextRequest } from "next/server";
import { resolverContextoTransportista } from "../auth/contexto-auth";
import { crearDependenciasTransportista } from "../composition";

export async function contextoTransportista() {
  const deps = crearDependenciasTransportista();
  const ctx = await resolverContextoTransportista({
    authenticator: deps.ports.authenticator,
    usuarios: deps.repositorios.usuarios,
  });
  return { deps, ctx };
}

export async function leerBody(req: NextRequest): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export function queryParams(req: NextRequest): Record<string, string> {
  const params: Record<string, string> = {};
  for (const [k, v] of req.nextUrl.searchParams.entries()) {
    params[k] = v;
  }
  return params;
}
