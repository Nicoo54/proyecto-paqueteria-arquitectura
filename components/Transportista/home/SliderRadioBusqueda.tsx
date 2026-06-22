import { Radar } from "lucide-react";

interface Props {
  radioKm: number;
  onChange: (valor: number) => void;
}

export function SliderRadioBusqueda({ radioKm, onChange }: Props) {
  const pct = ((radioKm - 1) / 49) * 100;

  return (
    <div className="bg-slate-900 px-5 py-4 border-b border-slate-800 sticky top-0 z-10">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Radar className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Radio de búsqueda
          </span>
        </div>
        <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg">
          {radioKm} km
        </span>
      </div>

      <input
        type="range"
        min="1"
        max="50"
        step="1"
        value={radioKm}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, #f59e0b ${pct}%, #334155 ${pct}%)`,
        }}
        className="w-full h-1 rounded-full appearance-none cursor-pointer outline-none
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-amber-400
          [&::-webkit-slider-thumb]:border-[3px]
          [&::-webkit-slider-thumb]:border-slate-900
          [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_#f59e0b]
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-amber-400
          [&::-moz-range-thumb]:border-[3px]
          [&::-moz-range-thumb]:border-slate-900
          [&::-moz-range-thumb]:shadow-[0_0_0_2px_#f59e0b]"
      />

      <div className="flex justify-between mt-2 px-0.5">
        <span className="text-[10px] font-bold text-slate-600">1 km</span>
        <span className="text-[10px] font-bold text-slate-600">50 km</span>
      </div>
    </div>
  );
}
