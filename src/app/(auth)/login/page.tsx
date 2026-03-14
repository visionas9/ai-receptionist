"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FFFCF7] flex items-center justify-center px-4">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&display=swap'); .font-display { font-family: 'Fraunces', serif; }`}</style>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-[#1a1a1a]"
          >
            Receply
          </Link>
          <h1 className="font-display text-3xl font-black text-[#1a1a1a] mt-6 mb-2">
            Welcome back
          </h1>
          <p className="text-[#666] text-sm">
            Sign in to your clinic dashboard
          </p>
        </div>

        <div className="bg-white border border-[#f0ebe0] rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl mb-6">
              {error}
            </div>
          )}
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-[#1a1a1a] block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#f0ebe0] rounded-xl bg-[#FFFCF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#E65100]/20 focus:border-[#E65100] transition-colors"
                placeholder="you@clinic.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1a1a1a] block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-3 border border-[#f0ebe0] rounded-xl bg-[#FFFCF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#E65100]/20 focus:border-[#E65100] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-6 bg-[#1a1a1a] text-white py-3 rounded-full text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-sm text-[#666] mt-6">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-[#E65100] hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
