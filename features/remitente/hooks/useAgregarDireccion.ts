import { useState } from "react";
import { useRouter } from "next/navigation";
import { direccionesService } from "@/features/remitente/services/direccionesService";
import { NuevaDireccionPayload } from "../types/direccione";
import { useApiClient } from "@/shared/api-client";

export function useAgregarDireccion() {
  const router = useRouter();
  const { apiFetch } = useApiClient();
  const [searchText, setSearchText] = useState("");
  const [direccionLista, setDireccionLista] =
    useState<NuevaDireccionPayload | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeleccionMapbox = (feature: any) => {
    const nombreCompleto = feature.properties.name || feature.place_name;

    let contextoCiudad = null;
    if (Array.isArray(feature.properties.context)) {
      contextoCiudad =
        feature.properties.context.find((c: any) => c.id?.startsWith("place"))
          ?.text || null;
    } else if (feature.properties.context?.place?.name) {
      contextoCiudad = feature.properties.context.place.name;
    } else if (feature.properties.city) {
      contextoCiudad = feature.properties.city;
    }

    setSearchText(nombreCompleto);
    setDireccionLista({
      direccion: nombreCompleto,
      ciudad: contextoCiudad,
      origen_lng: feature.geometry.coordinates[0],
      origen_lat: feature.geometry.coordinates[1],
    });
    setError(null);
  };

  const limpiarSeleccion = () => {
    setDireccionLista(null);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!direccionLista) {
      setError(
        "Por favor, seleccioná una dirección válida del menú desplegable.",
      );
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await direccionesService.guardarDireccion(direccionLista, apiFetch);
      router.push("/cliente/cotizar");
    } catch (err) {
      setError("Ocurrió un error al guardar la dirección.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    searchText,
    setSearchText,
    direccionLista,
    handleSeleccionMapbox,
    limpiarSeleccion,
    isSaving,
    error,
    guardar,
    router,
  };
}
