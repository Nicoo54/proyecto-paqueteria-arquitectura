"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRadarTransportista } from "@/features/transportista/hooks/useRadarTransportista";
import { PaqueteDisponible } from "@/features/transportista/types/types";
import { VistaOffline } from "@/components/Transportista/home/VistaOffline";
import { VistaCargando } from "@/components/Transportista/home/VistaCargando";
import { VistaViajeActivo } from "@/components/Transportista/home/VistaViajeActivo";
import { ListaPaquetes } from "@/components/Transportista/home/ListaPaquetes";
import ModalDetallePaquete from "@/components/Transportista/home/ModalDetallePaquete";

export default function RadarTransportistaPage() {
  const router = useRouter();
  const { isOnline, isLoading, viajeActivo, paquetes } =
    useRadarTransportista();
  const [paqueteSeleccionado, setPaqueteSeleccionado] =
    useState<PaqueteDisponible | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAceptarViaje = async () => {
    if (!paqueteSeleccionado) return;
    setIsAccepting(true);

    // TODO: Cambiar por llamada a API para aceptar viaje
    setTimeout(() => {
      setIsAccepting(false);
      router.push(`/transportista/viaje/${paqueteSeleccionado.id}`);
    }, 1200);
  };

  if (!isOnline) return <VistaOffline />;
  if (isLoading) return <VistaCargando />;
  if (viajeActivo) return <VistaViajeActivo viajeId={viajeActivo.id} />;

  return (
    <>
      <ListaPaquetes
        paquetes={paquetes}
        onSeleccionar={setPaqueteSeleccionado}
      />
      <ModalDetallePaquete
        paquete={paqueteSeleccionado}
        isAccepting={isAccepting}
        onClose={() => setPaqueteSeleccionado(null)}
        onAceptar={handleAceptarViaje}
      />
    </>
  );
}
