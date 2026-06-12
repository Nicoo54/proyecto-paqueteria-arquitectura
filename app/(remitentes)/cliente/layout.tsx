import ClienteHeader from "@/components/Landing/Cliente/ClienteHeader";

export default function RemitenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ClienteHeader />

      <main className="flex-1 w-full max-w-5xl mx-auto p-6">{children}</main>
    </div>
  );
}
