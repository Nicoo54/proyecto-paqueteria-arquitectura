import { NextRequest } from "next/server";

export interface StatusUsuario {
  onboardingCompleto: boolean;
  rol: string;
}

export const edgeAuthService = {
  async obtenerStatus(req: NextRequest): Promise<StatusUsuario> {
    try {
      const statusUrl = new URL("/api/usuarios/me/status", req.url);

      const response = await fetch(statusUrl, {
        method: "GET",
        headers: {
          Cookie: req.headers.get("cookie") || "",
          Authorization: req.headers.get("authorization") || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          onboardingCompleto: data.onboardingCompleto,
          rol: data.role || "remitente",
        };
      }
    } catch (error) {
      console.error("Error en Edge Service consultando DB:", error);
    }

    return { onboardingCompleto: false, rol: "remitente" };
  },
};
