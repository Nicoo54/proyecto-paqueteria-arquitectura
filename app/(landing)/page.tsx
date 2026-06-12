import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeroActions from "@/components/Landing/HeroActions";

//TODO: Si esta logueado redirigir a su dashboard correspondiente (cliente o transportista)

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <HeroSection />

      <StepSection />

      <TargetSplit />

      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="w-full px-6 py-28 md:py-36 flex flex-col items-center text-center relative overflow-hidden bg-white border-b border-slate-100">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-75 bg-linear-to-b from-amber-100/30 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
          Tus envíos, a la velocidad de la{" "}
          <span className="bg-linear-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            ciudad.
          </span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-slate-500 font-normal leading-relaxed mb-12">
          Conectamos personas que necesitan realizar envíos con una red
          colaborativa de conductores listos para retirar en minutos. Simple,
          eficiente y 100% transparente.
        </p>
        <HeroActions />
      </div>
    </section>
  );
}

function StepSection() {
  return (
    <section className="container mx-auto px-6 py-24 max-w-6xl">
      <div className="flex flex-col items-center text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
          Como funciona Packeteer?
        </h2>
        <div className="h-1 w-12 bg-amber-500 rounded-full" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <StepCard
          icon="📍"
          title="1. Cotizá y publicá"
          description="Ingresá origen, destino y tamaño de tu paquete. Obtené tarifas fijas calculadas al instante mediante nuestro algoritmo de rutas."
        />

        <StepCard
          icon="🤝"
          title="2. Match automático"
          description="Nuestro servicio asigna el viaje al transportista disponible más cercano cuyo vehículo sea compatible con la carga."
        />

        <StepCard
          icon="📱"
          title="3. Seguimiento en vivo"
          description="Seguí el recorrido en tiempo real desde la app. Recibí notificaciones en cada etapa: retiro, tránsito y entrega final."
        />
      </div>
    </section>
  );
}

function StepCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-white border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 rounded-2xl overflow-hidden group">
      <CardHeader className="pt-8 px-8">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <CardTitle className="text-xl font-bold text-slate-900 pt-4">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <p className="text-slate-500 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function TargetSplit() {
  return (
    <section className="flex flex-col md:flex-row w-full overflow-hidden border-y border-slate-200/60">
      <div className="flex-1 bg-slate-900 text-white p-12 md:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-800">
        <div className="max-w-md mx-auto w-full">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-xs block mb-2">
            Para Clientes Corporativos y Particulares
          </span>
          <h2 className="text-3xl font-extrabold mb-8 tracking-tight">
            Soluciones corporativas de envío exprés
          </h2>
          <ul className="space-y-5 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-amber-400">✓</span>{" "}
              <span>
                Precios transparentes optimizados por demanda geográfica y
                clima.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400">✓</span>{" "}
              <span>
                Pasarela de pagos segura con múltiples opciones: tarjetas,
                billeteras digitales y transferencias bancarias.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400">✓</span>{" "}
              <span>
                Validación de calidad al finalizar mediante sistema de reseñas
                de 5 estrellas.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-1 bg-amber-400/95 text-slate-900 p-12 md:p-24 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <span className="text-slate-900/60 font-bold uppercase tracking-wider text-xs block mb-2">
            Para Conductores Independientes
          </span>
          <h2 className="text-3xl font-extrabold mb-8 tracking-tight">
            Monetizá tus viajes urbanos diarios
          </h2>
          <ul className="space-y-5 text-slate-900/85">
            <li className="flex items-start gap-3">
              <span className="text-slate-900">✓</span>{" "}
              <span>
                Flexibilidad laboral absoluta: Conectate y desconectate con un
                solo boton.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-slate-900">✓</span>{" "}
              <span>
                Filtros avanzados automáticos que protegen la capacidad de carga
                de tu vehículo.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-slate-900">✓</span>{" "}
              <span>
                Liquidación inmediata de fondos directo a tu alias bancario
                registrado.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-white py-14 text-center border-t border-slate-100">
      <div className="container mx-auto px-6 max-w-4xl flex flex-col items-center">
        <p className="text-slate-900 font-black tracking-tight text-lg mb-2">
          Packeteer<span className="text-amber-500">.</span>
        </p>
        <p className="text-sm text-slate-400 mb-6 font-normal">
          Plataforma de Logística Colaborativa de Próxima Generación · 2026
        </p>
        <div className="flex justify-center gap-8 text-sm font-semibold text-slate-500">
          <Link
            href="/soporte"
            className="hover:text-amber-500 transition-colors"
          >
            Soporte Técnico
          </Link>
          <Link
            href="/terminos"
            className="hover:text-amber-500 transition-colors"
          >
            Términos y Condiciones
          </Link>
          <Link
            href="/admin"
            className="text-slate-400 hover:text-slate-900 transition-colors border-l border-slate-200 pl-8"
          >
            Acceso Interno (Helpers)
          </Link>
        </div>
      </div>
    </footer>
  );
}
