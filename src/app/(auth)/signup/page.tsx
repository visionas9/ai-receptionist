"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // If Supabase requires email confirmation, no session is returned
    if (!data.session) {
      setLoading(false);
      setConfirmationSent(true);
      return;
    }

    // Session exists — email confirmation is disabled, proceed with clinic creation
    if (data.user) {
      const { error: clinicError } = await supabase
        .from("clinics")
        .insert({
          user_id: data.user.id,
          name: "My Business",
          owner_name: ownerName,
        });

      if (clinicError) {
        setError(clinicError.message);
        setLoading(false);
        return;
      }
    }

    router.push("/onboarding");
  };

  if (confirmationSent) {
    return (
      <div className="min-h-screen bg-[#FFFCF7] flex items-center justify-center px-4">
<div className="w-full max-w-md text-center">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-[#1a1a1a]"
          >
            Receply
          </Link>
          <div className="bg-white border border-[#f0ebe0] rounded-2xl p-8 shadow-sm mt-8">
            <div className="w-12 h-12 bg-[#FFF3E0] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#E65100]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-black text-[#1a1a1a] mb-2">
              Check your email
            </h1>
            <p className="text-[#666] text-sm mb-4">
              We sent a confirmation link to <span className="font-medium text-[#1a1a1a]">{email}</span>.
              Click the link to activate your account.
            </p>
            <Link
              href="/login"
              className="text-sm text-[#E65100] hover:underline font-medium"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCF7] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-[#1a1a1a]"
          >
            Receply
          </Link>
          <h1 className="font-display text-3xl font-black text-[#1a1a1a] mt-6 mb-2">
            Create your account
          </h1>
          <p className="text-[#666] text-sm">
            Start managing your business with AI
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
                Your Name
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-4 py-3 border border-[#f0ebe0] rounded-xl bg-[#FFFCF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#E65100]/20 focus:border-[#E65100] transition-colors"
                placeholder="Dr. John Smith"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1a1a1a] block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#f0ebe0] rounded-xl bg-[#FFFCF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#E65100]/20 focus:border-[#E65100] transition-colors"
                placeholder="you@business.com"
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
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                className="w-full px-4 py-3 border border-[#f0ebe0] rounded-xl bg-[#FFFCF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#E65100]/20 focus:border-[#E65100] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {loading ? (
            <div className="w-full mt-6 bg-[#1a1a1a] text-white py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Creating your account...
            </div>
          ) : (
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full mt-6 bg-[#1a1a1a] text-white py-3 rounded-full text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              Create account
            </button>
          )}

          <p className="text-center text-sm text-[#666] mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#E65100] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
