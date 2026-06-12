import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SiteBrand from "./SiteBrand";

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/75 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <SiteBrand />

        <nav className="flex items-center gap-6">
          <AnonimousActions />

          <UserActions />
        </nav>
      </div>
    </header>
  );
}

function AnonimousActions() {
  return (
    <Show when="signed-out">
      <SignInButton mode="modal">
        <Button
          size="sm"
          className="rounded-full font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-sm px-5 transition-all"
        >
          Iniciar Sesión
        </Button>
      </SignInButton>
    </Show>
  );
}

function UserActions() {
  return (
    <Show when="signed-in">
      <Link
        href="/onboarding"
        className="text-sm font-semibold text-slate-600 hover:text-amber-600 transition-colors mr-2"
      >
        Mi Panel
      </Link>
      <div className="border-l border-slate-200 pl-4 h-6 flex items-center">
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox:
                "w-8 h-8 rounded-full border border-slate-200 shadow-sm",
            },
          }}
        />
      </div>
    </Show>
  );
}
