export function VistaCargando() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-100">
      <div className="relative">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full animate-ping absolute inset-0" />
        <div className="w-16 h-16 bg-emerald-500/40 rounded-full flex items-center justify-center relative z-10">
          <span className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
      <p className="mt-6 text-slate-600 font-bold animate-pulse">
        Buscando viajes cercanos...
      </p>
    </div>
  );
}
