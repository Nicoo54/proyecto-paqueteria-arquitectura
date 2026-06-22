import {
  clerkMiddleware,
  createClerkClient,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { edgeAuthService } from "./lib/auth";

const isPublicRoute = createRouteMatcher(["/", "/onboarding(.*)"]);

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const RUTAS_POR_ROL: Record<string, string> = {
  transportista: "/transportista",
  admin: "/soporte",
};

const ROL_REQUERIDO: Record<string, string> = {
  "/cliente": "remitente",
  "/transportista": "transportista",
  "/soporte": "admin",
};

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  const pathname = req.nextUrl.pathname;
  const path = req.nextUrl.pathname;
  // Caso 1. No logueado: rutas públicas pasan, el resto va al login
  if (!userId) {
    if (isPublicRoute(req)) return;
    return redirectToSignIn();
  }

  // Permitir pasar a las rutas de API sin importar el estado del onboarding,
  // para que el frontend pueda usarlas para completar el proceso
  if (
    path.startsWith("/api/remitentes") ||
    path.startsWith("/api/transportistas") ||
    path.startsWith("/api/usuarios/me/status")
  ) {
    return NextResponse.next();
  }

  const user = await clerkClient.users.getUser(userId);
  const rol = (user.publicMetadata?.role as string) ?? "remitente";

  // Esto esta feo. Debe obtenerse por metadatos de clerk pero
  // no se están seteando bien al parecer. Por eso por ahora se consulta a la DB directamente.
  const { onboardingCompleto } = await edgeAuthService.obtenerStatus(req);

  // Caso 2. Onboarding incompleto → solo puede estar en /onboarding o /
  if (!onboardingCompleto) {
    if (!pathname.startsWith("/onboarding") && pathname !== "/") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    return; // dejar pasar /onboarding y /
  }

  // Caso 3. Onboarding completo intentando volver al onboarding o landing → su dashboard
  if (pathname.startsWith("/onboarding") || pathname === "/") {
    const destino = RUTAS_POR_ROL[rol] ?? "/cliente";
    return NextResponse.redirect(new URL(destino, req.url));
  }

  // Caso 4. Intentando entrar a sección que no le corresponde → su dashboard
  const seccion = Object.keys(ROL_REQUERIDO).find((ruta) =>
    pathname.startsWith(ruta),
  );
  if (seccion && ROL_REQUERIDO[seccion] !== rol) {
    const destino = RUTAS_POR_ROL[rol] ?? "/cliente";
    return NextResponse.redirect(new URL(destino, req.url));
  }

  // Caso 5. Todo ok → dejar pasar
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for Clerk's auto-proxy path
    "/__clerk/:path*",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
