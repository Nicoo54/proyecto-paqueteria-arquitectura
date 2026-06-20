"use client";

import { useRadarTransportista } from "@/features/transportista/hooks/useRadarTransportista";
import { VistaOffline } from "@/components/Transportista/home/VistaOffline";
import { VistaCargando } from "@/components/Transportista/home/VistaCargando";
import { VistaViajeActivo } from "@/components/Transportista/home/VistaViajeActivo";
import { ListaPaquetes } from "@/components/Transportista/home/ListaPaquetes";
import ModalDetallePaquete from "@/components/Transportista/home/ModalDetallePaquete";
import { Radar } from "lucide-react"; // Un iconito lindo para el slider
import { SliderRadioBusqueda } from "@/components/Transportista/home/SliderRadioBusqueda";

export default function RadarTransportistaPage() {
  const {
    isOnline,
    isLoading,
    viajeActivo,
    paquetes,
    paqueteSeleccionado,
    setPaqueteSeleccionado,
    isAccepting,
    handleAceptarViaje,
    radioKm,
    setRadioKm, // Traemos el estado del radio
  } = useRadarTransportista();

  if (!isOnline) return <VistaOffline />;
  if (viajeActivo) return <VistaViajeActivo viajeId={viajeActivo.id} />;

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative pb-20">
      <div className="flex flex-col h-full w-full bg-slate-50 relative pb-20 gap-6">
        <SliderRadioBusqueda radioKm={radioKm} onChange={setRadioKm} />

        {isLoading ? (
          <VistaCargando />
        ) : (
          <ListaPaquetes
            paquetes={paquetes}
            onSeleccionar={setPaqueteSeleccionado}
          />
        )}
      </div>
      <ModalDetallePaquete
        paquete={paqueteSeleccionado}
        isAccepting={isAccepting}
        onClose={() => setPaqueteSeleccionado(null)}
        onAceptar={handleAceptarViaje}
      />
    </div>
  );
}
