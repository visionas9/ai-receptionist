"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  clinicName: string;
  userEmail: string;
  ownerName: string;
  freeMinutes: number;
}

export default function DashboardHeader({
  clinicName,
  ownerName,
  freeMinutes,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const isLow = freeMinutes <= 5;
  const isEmpty = freeMinutes <= 0;

  return (
    <header className="border-b bg-[#FFFCF7] border-[#f0ebe0] sticky top-0 z-10">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&display=swap'); .font-display { font-family: 'Fraunces', serif; }`}</style>
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-xl text-[#1a1a1a]">
            Receply
          </span>
          <span className="text-[#f0ebe0]">/</span>
          <span className="text-[#666] text-sm hidden md:block">
            {clinicName}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Free minutes counter */}
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              isEmpty
                ? "bg-red-50 border-red-100 text-red-600"
                : isLow
                  ? "bg-[#FFF3E0] border-[#E65100]/20 text-[#E65100]"
                  : "bg-[#f8f4ee] border-[#f0ebe0] text-[#666]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isEmpty ? "bg-red-500" : isLow ? "bg-[#E65100]" : "bg-green-500"
              }`}
            />
            {isEmpty
              ? "Free minutes used up"
              : `${Math.round(freeMinutes)} min free remaining`}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-[#f0ebe0] px-3 py-1.5 rounded-full transition-colors">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-[#1a1a1a] text-white text-xs">
                    {ownerName ? ownerName.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-[#666] hidden md:block">
                  {ownerName}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#FFFCF7] border-[#f0ebe0]"
            >
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 cursor-pointer focus:text-red-500 focus:bg-red-50"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
