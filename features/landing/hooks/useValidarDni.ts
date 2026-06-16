import { DniSchema } from "@/schema/onboarding";
import { useState } from "react";

export function useValidarDni() {
  const [errorDni, setErrorDni] = useState<string | null>(null);

  const validarDni = (valor: string): boolean => {
    const resultado = DniSchema.safeParse({ dni: valor });
    if (!resultado.success) {
      setErrorDni(resultado.error.issues[0].message);
      return false;
    }
    setErrorDni(null);
    return true;
  };

  return { errorDni, setErrorDni, validarDni };
}
