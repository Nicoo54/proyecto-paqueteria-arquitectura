import SiteBrand from "@/components/SiteBrand";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import HeaderAction from "./HeaderAction";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClienteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex h-16 items-center justify-between px-6">
        <SiteBrand />

        <div className="flex items-center gap-8">
          <HeaderAction />

          <div className="relative w-9 h-9 flex items-center justify-center">
            <ClerkLoading>
              <Skeleton className="w-full h-full rounded-full bg-slate-200 border border-slate-200 animate-pulse" />
            </ClerkLoading>

            <ClerkLoaded>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border border-slate-200",
                  },
                }}
              />
            </ClerkLoaded>
          </div>
        </div>
      </div>
    </header>
  );
}
