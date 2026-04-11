"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  show: boolean;
}

export default function UpgradeBanner({ show }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!show) return;
    // Remove upgraded=true and uid from URL without a full navigation
    const url = new URL(window.location.href);
    url.searchParams.delete("upgraded");
    url.searchParams.delete("uid");
    router.replace(url.pathname + (url.search || ""));
  }, [show, router]);

  if (!show) return null;

  return (
    <div className="bg-[#E8F5E9] border-b border-[#C8E6C9]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3">
        <span className="w-2 h-2 bg-[#2E7D32] rounded-full flex-shrink-0" />
        <p className="text-sm font-medium text-[#2E7D32]">
          Welcome to Pro! Your 1,500 minutes are ready.
        </p>
      </div>
    </div>
  );
}
