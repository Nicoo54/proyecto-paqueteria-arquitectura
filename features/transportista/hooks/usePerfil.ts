import { perfilService } from "@/features/transportista/services/perfilService";
import { PerfilTransportista } from "@/features/transportista/services/perfil";
import { useState, useEffect } from "react";

export function usePerfil() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "exito" | "error";
    texto: string;
  } | null>(null);

  // Backups para revertir cambios seguros
  const [perfilOriginal, setPerfilOriginal] =
    useState<PerfilTransportista | null>(null);

  // Modos de Edición independientes por tarjeta
  const [isEditingVehiculo, setIsEditingVehiculo] = useState(false);
  const [isEditingCobro, setIsEditingCobro] = useState(false);

  // Estados reactivos del formulario
  const [categoria, setCategoria] = useState("BICI");
  const [patente, setPatente] = useState("");
  const [aliasBancario, setAliasBancario] = useState("");
  const [errorPatente, setErrorPatente] = useState<string | null>(null);
  const [errorAlias, setErrorAlias] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    perfilService.obtenerPerfil().then((data) => {
      if (!isMounted) return;
      setPerfilOriginal(data);
      setCategoria(data.categoria);
      setPatente(data.patente);
      setAliasBancario(data.alias_bancario);
      setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const validarPatente = (valor: string, cat: string) => {
    if (cat === "BICI") {
      setErrorPatente(null);
      return true;
    }
    if (!valor || valor.trim() === "") {
      setErrorPatente("La patente es requerida.");
      return false;
    }
    const regexPatente =
      /^[A-Z]{3}\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$|^\d{3}[A-Z]{3}$|^[A-Z]{1}\d{3}[A-Z]{3}$/i;
    if (!regexPatente.test(valor.replace(/\s/g, ""))) {
      setErrorPatente("Formato inválido (Ej: AA123AA o A123BCD).");
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

  const handleCambioCategoria = (nuevaCat: string) => {
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
      setCategoria(perfilOriginal.categoria);
      setPatente(perfilOriginal.patente);
    }
    setErrorPatente(null);
    setIsEditingVehiculo(false);
  };

  const cancelarCobro = () => {
    if (perfilOriginal) {
      setAliasBancario(perfilOriginal.alias_bancario);
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
      await perfilService.actualizarPerfil({
        categoria,
        patente: limpiaPatente,
      });
      if (perfilOriginal) {
        setPerfilOriginal({
          ...perfilOriginal,
          categoria,
          patente: limpiaPatente,
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
      await perfilService.actualizarPerfil({ alias_bancario: aliasBancario });
      if (perfilOriginal) {
        setPerfilOriginal({ ...perfilOriginal, alias_bancario: aliasBancario });
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
