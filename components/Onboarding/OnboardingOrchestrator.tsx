"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useUser, SignUp } from "@clerk/nextjs";
import { RemitenteForm } from "./RemitenteForm";
import TransportistaForm from "./TransportistaForm";

type RolOnboarding = "remitente" | "transportista";

export function OnboardingOrchestrator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rol = searchParams.get("role") as RolOnboarding | null;
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <Spinner mensaje="Verificando sesión..." />;
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <SignUp routing="hash" forceRedirectUrl={`/onboarding?role=${rol}`} />
      </div>
    );
  }

  const onExito = () => {
    router.push(rol === "transportista" ? "/transportista" : "/cliente");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 pt-12 px-4">
      {rol === "transportista" ? (
        <TransportistaForm onExito={onExito} />
      ) : (
        <RemitenteForm onExito={onExito} />
      )}
    </div>
  );
}

function Spinner({ mensaje }: { mensaje: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-6" />
      <h2 className="text-xl font-bold text-slate-900">{mensaje}</h2>
    </div>
  );
}
