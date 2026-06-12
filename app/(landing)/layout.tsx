import LandingHeader from "@/components/Landing/LandingHeader";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />

      <main className="flex-1 bg-slate-50/50">{children}</main>
    </div>
  );
}
