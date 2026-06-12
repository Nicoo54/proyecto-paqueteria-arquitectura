"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser, SignUp } from "@clerk/nextjs";
import TransportistaForm from "@/components/Onboarding/TransportistaForm";
import RemitenteForm from "@/components/Onboarding/RemitenteForm";

function OnboardingOrchestrator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFromUrl = searchParams.get("role");

  const { isLoaded, isSignedIn, user } = useUser();

  // TODO: Mejorar
  useEffect(() => {
    if (
      !roleFromUrl ||
      (roleFromUrl !== "remitente" && roleFromUrl !== "transportista")
    ) {
      router.push("/");
    }
  }, [roleFromUrl, router]);

  // TODO: Mover a proxy y hacerlo por fetch a API
  useEffect(() => {
    if (!isLoaded || !user) return;

    const userRole = user.publicMetadata?.role as string | undefined;

    if (userRole === "remitente") {
      router.push("/cliente");
    } else if (userRole === "transportista") {
      router.push("/transportistas");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold text-slate-900">
          Verificando sesión...
        </h2>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <SignUp
          routing="hash"
          forceRedirectUrl={`/onboarding?role=${roleFromUrl}`}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 pt-12 px-4">
      {roleFromUrl === "transportista" ? (
        <TransportistaForm />
      ) : (
        <RemitenteForm />
      )}
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <OnboardingOrchestrator />
    </Suspense>
  );
}
