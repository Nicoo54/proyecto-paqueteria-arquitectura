import ControlesHeader from "@/components/cliente/historial/ControlesHeader";
import EnviosTabla from "@/components/cliente/historial/EnviosTabla";

export default function HistorialPage() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <ControlesHeader />

      <EnviosTabla />
    </div>
  );
}
