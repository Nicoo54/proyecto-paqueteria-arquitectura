import { useState } from "react";
import { onboardingService } from "../services/onboardingService";
import { useValidarDni } from "./useValidarDni";
import { useApiClient } from "@/shared/api-client";

export function useOnboardingRemitente(onExito: () => void) {
  const { apiFetch } = useApiClient();
  const [dni, setDni] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errorDni, setErrorDni, validarDni } = useValidarDni();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarDni(dni)) return;

    setIsSubmitting(true);
    try {
      await onboardingService.registrarRemitente(dni, apiFetch);
      onExito();
    } catch (error: any) {
      setErrorDni("Ocurrió un error. Intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    dni,
    setDni,
    errorDni,
    setErrorDni,
    isSubmitting,
    handleSubmit,
    validarDni,
  };
}
