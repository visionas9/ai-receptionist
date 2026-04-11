"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

interface Props {
  savedLocale: string | null;
}

/**
 * Applies the Supabase-stored locale ONLY on the very first visit,
 * when the user has not yet manually selected a language (no localStorage entry).
 * Once the user manually toggles the language, localStorage is the source of truth
 * and this component will never override it.
 */
export default function LocaleSyncer({ savedLocale }: Props) {
  const currentLocale = useLocale();

  useEffect(() => {
    if (!savedLocale) return;

    // If the user has already manually selected a language, respect it.
    const manualLocale = localStorage.getItem("locale");
    if (manualLocale) return;

    // First visit: no manual preference set — apply the Supabase-stored locale.
    if (savedLocale === currentLocale) {
      // Already on the right locale; just record it so future toggles persist.
      localStorage.setItem("locale", currentLocale);
      return;
    }

    document.cookie = `NEXT_LOCALE=${savedLocale};path=/;max-age=31536000;SameSite=Lax`;
    localStorage.setItem("locale", savedLocale);
    window.location.reload();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
