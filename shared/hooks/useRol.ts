"use client";

import { useUser } from "@clerk/nextjs";

type Rol = "transportista" | "admin" | "remitente";

export function useRol(): { rol: Rol | null; isLoaded: boolean } {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return { rol: null, isLoaded };

  const rol = (user.publicMetadata?.role as Rol) ?? "remitente";

  return { rol, isLoaded };
}
