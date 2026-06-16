import { PatenteSchema } from "@/schema/onboarding";
import { useState } from "react";

export function useValidarPatente() {
  const [errorPatente, setErrorPatente] = useState<string | null>(null);

  const validarPatente = (valor: string): boolean => {
    const resultado = PatenteSchema.safeParse({ patente: valor });
    if (!resultado.success) {
      setErrorPatente(resultado.error.issues[0].message);
      return false;
    }
    setErrorPatente(null);
    return true;
  };

  return { errorPatente, setErrorPatente, validarPatente };
}
