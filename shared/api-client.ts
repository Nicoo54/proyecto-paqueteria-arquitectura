"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

export type ApiFetch = (url: string, options?: RequestInit) => Promise<any>;

export function useApiClient() {
  const { getToken } = useAuth();

  const apiFetch: ApiFetch = useCallback(
    async (url, options = {}) => {
      const token = await getToken();

      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      });

      if (!res.ok) {
        let mensajeError = `Error HTTP: ${res.status} ${res.statusText}`;

        try {
          const errorData = await res.json();

          if (errorData && errorData.error) {
            mensajeError = errorData.error;
          }
        } catch (e) {
          // Si no se pudo parsear el JSON, dejamos el mensaje genérico
        }

        throw new Error(mensajeError);
      }

      if (res.status === 204) return null;

      return res.json();
    },
    [getToken],
  );

  return { apiFetch };
}
