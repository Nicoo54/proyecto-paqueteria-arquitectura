import { OnboardingOrchestrator } from "@/components/Onboarding/OnboardingOrchestrator";
import { Suspense } from "react";

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OnboardingOrchestrator />
    </Suspense>
  );
}
