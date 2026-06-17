import Link from "next/link";

export default function SiteBrand() {
  return (
    <Link
      href="/"
      className="group text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1"
    >
      <span>Packeteer</span>
      <span className="text-amber-500 transition-transform group-hover:scale-125 inline-block">
        .
      </span>
    </Link>
  );
}
