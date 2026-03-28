"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

interface Props {
  savedLocale: string | null;
}

/**
 * Syncs the user's language preference to the active locale cookie — but only
 * ONCE per browser session (using sessionStorage as a "already synced" flag).
 *
 * Why sessionStorage?
 *   - sessionStorage survives window.location.reload(), so after the initial
 *     sync-reload the flag is still set and we don't re-apply savedLocale,
 *     which would override a manual LanguageSwitcher toggle.
 *   - sessionStorage is cleared when the tab is closed, so a fresh session
 *     always re-syncs from Supabase on the first dashboard load.
 *
 * Priority for the initial sync: clinic.language (Supabase) → localStorage
 * "locale" (set during onboarding) → no-op.
 */
export default function LocaleSyncer({ savedLocale }: Props) {
  const currentLocale = useLocale();

  useEffect(() => {
    // Already synced this session — let LanguageSwitcher be the authority.
    if (sessionStorage.getItem("locale_synced")) return;

    const target = savedLocale ?? localStorage.getItem("locale");

    // Mark synced regardless so we don't re-run after a no-op.
    sessionStorage.setItem("locale_synced", "1");

    if (!target) return;
    if (target === currentLocale) return;

    document.cookie = `NEXT_LOCALE=${target};path=/;max-age=31536000;SameSite=Lax`;
    localStorage.setItem("locale", target);
    window.location.reload();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
