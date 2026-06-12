// TODO: Usar lo del backend

import { DniSchema } from "@/schema/onboarding";
import { useState } from "react";

export const CATEGORIAS_VEHICULOS = [
  { id: "BICI", label: "Bici", icon: "🚲", tienePatente: false },
  { id: "MOTO", label: "Moto", icon: "🏍️", tienePatente: true },
  { id: "AUTO", label: "Auto", icon: "🚗", tienePatente: true },
] as const;

export type CategoriaVehiculo = (typeof CATEGORIAS_VEHICULOS)[number];

export const useValidarDni = () => {
  const [errorDni, setErrorDni] = useState<string | null>(null);

  const validarDni = (valor: string) => {
    const resultado = DniSchema.safeParse({ dni: valor });

    if (!resultado.success) {
      setErrorDni(resultado.error.issues[0].message);
      return false;
    }

    setErrorDni(null);
    return true;
  };

  return {
    errorDni,
    validarDni,
    setErrorDni,
  };
};
