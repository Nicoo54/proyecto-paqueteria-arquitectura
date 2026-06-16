"use client";

import { useUser } from "@clerk/nextjs";
import { CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { usePerfil } from "@/features/transportista/hooks/usePerfil";
import { PerfilHeader } from "@/components/Transportista/perfil/PerfilHeader";
import { SeccionVehiculo } from "@/components/Transportista/perfil/SeccionVehiculo";
import { SeccionCobro } from "@/components/Transportista/perfil/SeccionCobro";

export default function PerfilDashboardPage() {
  const { user } = useUser();
  const {
    isLoading,
    isSaving,
    mensaje,
    perfilOriginal,
    isEditingVehiculo,
    setIsEditingVehiculo,
    isEditingCobro,
    setIsEditingCobro,
    categoria,
    handleCambioCategoria,
    patente,
    setPatente,
    errorPatente,
    validarPatente,
    aliasBancario,
    setAliasBancario,
    errorAlias,
    validarAlias,
    cancelarVehiculo,
    cancelarCobro,
    guardarVehiculo,
    guardarCobro,
  } = usePerfil();

  if (isLoading) {
    return (
      <div className="flex-1 bg-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-8 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        <PerfilHeader
          nombre={user?.fullName || "Conductor Registrado"}
          imageUrl={user?.imageUrl}
          promedioCalificacion={perfilOriginal?.promedio_calificacion}
          cantidadResenas={perfilOriginal?.cantidad_resenas}
        />

        {mensaje && (
          <div
            className={`p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
              mensaje.tipo === "exito"
                ? "bg-emerald-50 border border-emerald-200"
                : "bg-rose-50 border border-rose-200"
            }`}
          >
            {mensaje.tipo === "exito" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5" />
            )}
            <p
              className={`text-sm font-medium ${
                mensaje.tipo === "exito" ? "text-emerald-800" : "text-rose-800"
              }`}
            >
              {mensaje.texto}
            </p>
          </div>
        )}

        <SeccionVehiculo
          isEditing={isEditingVehiculo}
          onEditar={() => setIsEditingVehiculo(true)}
          onCancelar={cancelarVehiculo}
          onSubmit={guardarVehiculo}
          isSaving={isSaving}
          categoriaActual={perfilOriginal?.categoria}
          patenteActual={perfilOriginal?.patente}
          categoria={categoria}
          onCambioCategoria={handleCambioCategoria}
          patente={patente}
          setPatente={setPatente}
          errorPatente={errorPatente}
          validarPatente={validarPatente}
        />

        <SeccionCobro
          isEditing={isEditingCobro}
          onEditar={() => setIsEditingCobro(true)}
          onCancelar={cancelarCobro}
          onSubmit={guardarCobro}
          isSaving={isSaving}
          aliasActual={perfilOriginal?.alias_bancario}
          aliasBancario={aliasBancario}
          setAliasBancario={setAliasBancario}
          errorAlias={errorAlias}
          validarAlias={validarAlias}
        />

        <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Los cambios
          de credenciales requieren validación de la CNV.
        </p>
      </div>
    </div>
  );
}
