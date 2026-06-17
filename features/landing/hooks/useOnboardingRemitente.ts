import { useState } from "react";
import { onboardingService } from "../services/onboardingService";
import { useValidarDni } from "./useValidarDni";

export function useOnboardingRemitente(onExito: () => void) {
  const [dni, setDni] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errorDni, setErrorDni, validarDni } = useValidarDni();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarDni(dni)) return;

    setIsSubmitting(true);
    try {
      await onboardingService.registrarRemitente(dni);
      onExito();
    } catch {
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
