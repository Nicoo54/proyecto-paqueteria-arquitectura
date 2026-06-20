"use client";

import { useState, useEffect } from "react";
import { perfilService } from "@/features/transportista/services/perfilService";
import type { TransportistaDto, CategoriaVehiculo } from "@/lib/api-contract";
import { useApiClient } from "@/shared/api-client";

export function usePerfil() {
  const { apiFetch } = useApiClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "exito" | "error";
    texto: string;
  } | null>(null);

  // Backups para revertir cambios seguros
  const [perfilOriginal, setPerfilOriginal] = useState<TransportistaDto | null>(
    null,
  );

  // Modos de Edición independientes por tarjeta
  const [isEditingVehiculo, setIsEditingVehiculo] = useState(false);
  const [isEditingCobro, setIsEditingCobro] = useState(false);

  // Estados reactivos del formulario (Tipados con el contrato)
  const [categoria, setCategoria] = useState<CategoriaVehiculo>("BICI");
  const [patente, setPatente] = useState("");
  const [aliasBancario, setAliasBancario] = useState("");
  const [errorPatente, setErrorPatente] = useState<string | null>(null);
  const [errorAlias, setErrorAlias] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    perfilService.obtenerPerfil(apiFetch).then((data) => {
      if (!isMounted) return;
      setPerfilOriginal(data);

      setCategoria(data.vehiculo?.categoria || "BICI");
      setPatente(data.vehiculo?.patente || "");
      setAliasBancario(data.aliasBancario || "");

      setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [apiFetch]);

  const validarPatente = (valor: string, cat: CategoriaVehiculo) => {
    if (cat === "BICI") {
      setErrorPatente(null);
      return true;
    }
    if (!valor || valor.trim() === "") {
      setErrorPatente("La patente es requerida.");
      return false;
    }
    const regexPatente = /^[A-Z]{3}\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/i;
    if (!regexPatente.test(valor.replace(/\s/g, ""))) {
      setErrorPatente("Formato inválido (Ej: AA123AA o AAA123).");
      return false;
    }
    setErrorPatente(null);
    return true;
  };

  const validarAlias = (valor: string) => {
    if (!valor || valor.trim().length < 6) {
      setErrorAlias("El alias debe contener al menos 6 caracteres.");
      return false;
    }
    setErrorAlias(null);
    return true;
  };

  const handleCambioCategoria = (nuevaCat: CategoriaVehiculo) => {
    setCategoria(nuevaCat);
    if (nuevaCat === "BICI") {
      setPatente("");
      setErrorPatente(null);
    } else {
      validarPatente(patente, nuevaCat);
    }
  };

  const cancelarVehiculo = () => {
    if (perfilOriginal) {
      setCategoria(perfilOriginal.vehiculo?.categoria || "BICI");
      setPatente(perfilOriginal.vehiculo?.patente || "");
    }
    setErrorPatente(null);
    setIsEditingVehiculo(false);
  };

  const cancelarCobro = () => {
    if (perfilOriginal) {
      setAliasBancario(perfilOriginal.aliasBancario || "");
    }
    setErrorAlias(null);
    setIsEditingCobro(false);
  };

  const guardarVehiculo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarPatente(patente, categoria)) return;

    setIsSaving(true);
    try {
      const limpiaPatente =
        categoria === "BICI" ? "" : patente.replace(/\s/g, "").toUpperCase();

      await perfilService.actualizarVehiculo(
        {
          categoria,
          patente: limpiaPatente || null,
        },
        apiFetch,
      );

      if (perfilOriginal) {
        setPerfilOriginal({
          ...perfilOriginal,
          vehiculo: {
            ...(perfilOriginal.vehiculo || { id: 0 }),
            categoria,
            patente: limpiaPatente || null,
          },
        });
      }
      setMensaje({ tipo: "exito", texto: "Datos del vehículo actualizados." });
      setIsEditingVehiculo(false);
    } catch {
      setMensaje({
        tipo: "error",
        texto: "Error al guardar los datos del vehículo.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const guardarCobro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarAlias(aliasBancario)) return;

    setIsSaving(true);
    try {
      await perfilService.actualizarAlias({ aliasBancario }, apiFetch);

      if (perfilOriginal) {
        setPerfilOriginal({ ...perfilOriginal, aliasBancario });
      }
      setMensaje({
        tipo: "exito",
        texto: "Datos de cobro actualizados de forma segura.",
      });
      setIsEditingCobro(false);
    } catch {
      setMensaje({
        tipo: "error",
        texto: "Error al actualizar la cuenta de cobro.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading,
    isSaving,
    mensaje,
    perfilOriginal,
    isEditingVehiculo,
    setIsEditingVehiculo,
    isEditingCobro,
    setIsEditingCobro,
    categoria,
    handleCambioCategoria,
    patente,
    setPatente,
    errorPatente,
    validarPatente,
    aliasBancario,
    setAliasBancario,
    errorAlias,
    validarAlias,
    cancelarVehiculo,
    cancelarCobro,
    guardarVehiculo,
    guardarCobro,
  };
}
