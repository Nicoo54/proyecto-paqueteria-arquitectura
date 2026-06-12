import SiteBrand from "@/components/SiteBrand";
import { UserButton } from "@clerk/nextjs";
import HeaderAction from "./HeaderAction";

export default function ClienteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex h-16 items-center justify-between px-6">
        <SiteBrand />

        <div className="flex items-center gap-8">
          <HeaderAction />

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
