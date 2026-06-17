import { useState } from "react";
import { onboardingService } from "../services/onboardingService";
import { useValidarDni } from "./useValidarDni";
import { useValidarPatente } from "./useValidarPatente";

export function useOnboardingTransportista(onExito: () => void) {
  const [dni, setDni] = useState("");
  const [categoria, setCategoria] = useState("");
  const [patente, setPatente] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [errorCategoria, setErrorCategoria] = useState<string | null>(null);

  const { errorDni, setErrorDni, validarDni } = useValidarDni();
  const { errorPatente, setErrorPatente, validarPatente } = useValidarPatente();

  const [aliasBancario, setAliasBancario] = useState("");
  const [errorAliasBancario, setErrorAliasBancario] = useState<string | null>(
    null,
  );

  const requierePatente = categoria && categoria !== "BICI";

  const validarAliasBancario = (valor: string): boolean => {
    if (!valor.trim()) {
      setErrorAliasBancario("Ingresá tu CBU, CVU o alias.");
      return false;
    }
    setErrorAliasBancario(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dniValido = validarDni(dni);

    if (!categoria) {
      setErrorCategoria("Seleccioná un tipo de vehículo.");
      if (!dniValido) return;
      return;
    } else {
      setErrorCategoria(null);
    }

    const patenteValida = requierePatente ? validarPatente(patente) : true;
    if (!dniValido || !patenteValida) return;

    const bancarioValido = validarAliasBancario(aliasBancario);
    if (!dniValido || !categoria || !patenteValida || !bancarioValido) return;

    setIsSubmitting(true);
    try {
      await onboardingService.registrarTransportista({
        dni,
        categoria,
        patente,
        aliasBancario,
      });
      onExito();
    } catch {
      setErrorGeneral("Ocurrió un error. Intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    dni,
    setDni,
    categoria,
    setCategoria,
    patente,
    setPatente,
    requierePatente,
    errorDni,
    setErrorDni,
    errorPatente,
    setErrorPatente,
    errorGeneral,
    isSubmitting,
    handleSubmit,
    errorCategoria,
    setErrorCategoria,
    aliasBancario,
    setAliasBancario,
    errorAliasBancario,
    setErrorAliasBancario,
    validarDni,
    validarPatente,
    validarAliasBancario,
  };
}
