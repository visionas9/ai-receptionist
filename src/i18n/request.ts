import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const VALID_LOCALES = ["pl", "en"] as const;
type Locale = (typeof VALID_LOCALES)[number];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  const locale: Locale = VALID_LOCALES.includes(raw as Locale)
    ? (raw as Locale)
    : "pl";

  const messages =
    locale === "en"
      ? (await import("../../messages/en.json")).default
      : (await import("../../messages/pl")).default;

  return { locale, messages };
});
