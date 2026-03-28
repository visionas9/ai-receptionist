"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

interface Props {
  savedLocale: string | null;
}

/**
 * Syncs the user's language preference to the active locale cookie on load.
 * Priority: clinic.language from Supabase → localStorage "locale" → no-op.
 * Falls back to localStorage so it works even before the Supabase migration runs.
 */
export default function LocaleSyncer({ savedLocale }: Props) {
  const currentLocale = useLocale();

  useEffect(() => {
    const target = savedLocale ?? localStorage.getItem("locale");
    if (!target) return;
    if (target === currentLocale) return;

    document.cookie = `NEXT_LOCALE=${target};path=/;max-age=31536000;SameSite=Lax`;
    localStorage.setItem("locale", target);
    window.location.reload();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
