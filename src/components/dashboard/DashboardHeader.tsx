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
}

export default function DashboardHeader({
  clinicName,
  userEmail,
  ownerName,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-[#f0ebe0] px-3 py-1.5 rounded-full transition-colors">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-[#1a1a1a] text-white text-xs">
                  {userEmail.charAt(0).toUpperCase()}
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
    </header>
  );
}
