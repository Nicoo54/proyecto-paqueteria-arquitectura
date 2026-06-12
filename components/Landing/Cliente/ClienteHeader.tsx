import SiteBrand from "@/components/SiteBrand";
import { UserButton } from "@clerk/nextjs";
import { Clock, HelpCircle, Package } from "lucide-react";
import Link from "next/link";

export default function ClienteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex h-16 items-center justify-between px-6">
        <SiteBrand />

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6">
            <IconLink href="/cliente" icon={Package} text="Inicio" />
            <IconLink href="/cliente/historial" icon={Clock} text="Historial" />
            <IconLink
              href="/cliente/soporte"
              icon={HelpCircle}
              text="Soporte"
            />
          </nav>

          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9 border border-slate-200",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}

function IconLink({
  href,
  icon: Icon,
  text,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors"
    >
      <Icon className="w-4 h-4" /> {text}
    </Link>
  );
}
