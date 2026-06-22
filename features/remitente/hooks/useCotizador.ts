import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ubicacion } from "@/shared/types/ubicacion";
import { CotizacionResponse } from "../types/cotizacion";
import { cotizacionService } from "../services/cotizacionService";
import { useApiClient } from "@/shared/api-client";

export function useCotizador(
  origen: Ubicacion | null,
  destino: Ubicacion | null,
) {
  const router = useRouter();
  const { apiFetch } = useApiClient();
  const [origenTexto, setOrigenTexto] = useState("");
  const [destinoTexto, setDestinoTexto] = useState("");
  const [tamanoSeleccionado, setTamanoSeleccionado] = useState<string>("S");

  const [isCotizando, setIsCotizando] = useState(false);
  const [cotizacion, setCotizacion] = useState<CotizacionResponse | null>(null);

  const handleCotizar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origen || !destino || !tamanoSeleccionado) return;

    setIsCotizando(true);
    setCotizacion(null);
    try {
      const resultado = await cotizacionService.cotizarEnvio(
        {
          origen,
          destino,
          tamano: tamanoSeleccionado,
        },
        apiFetch,
      );
      setCotizacion(resultado);
    } catch (error) {
      console.error("Error al cotizar:", error);
    } finally {
      setIsCotizando(false);
    }
  };

  const handleSolicitarEnvio = () => {
    sessionStorage.setItem(
      "draft_envio",
      JSON.stringify({
        origen,
        destino,
        tamanoSeleccionado,
        cotizacion,
      }),
    );
    router.push("/cliente/cotizar/resumen");
  };

  return {
    origenTexto,
    setOrigenTexto,
    destinoTexto,
    setDestinoTexto,
    tamanoSeleccionado,
    setTamanoSeleccionado,
    isCotizando,
    cotizacion,
    setCotizacion,
    handleCotizar,
    handleSolicitarEnvio,
  };
}
