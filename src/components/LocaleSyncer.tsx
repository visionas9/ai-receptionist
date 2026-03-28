"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

interface Props {
  savedLocale: string | null;
}

/**
 * Reads the language preference saved in the clinic's Supabase record
 * and syncs it to the active locale cookie on dashboard load.
 */
export default function LocaleSyncer({ savedLocale }: Props) {
  const currentLocale = useLocale();

  useEffect(() => {
    if (!savedLocale) return;
    if (savedLocale === currentLocale) return;

    document.cookie = `NEXT_LOCALE=${savedLocale};path=/;max-age=31536000;SameSite=Lax`;
    localStorage.setItem("locale", savedLocale);
    window.location.reload();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
