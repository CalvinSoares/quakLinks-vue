import { ref } from "vue";

export type AppLocale = "pt" | "en" | "es";

export const APP_LANGUAGE_STORAGE_KEY = "app-language";

export const appLanguageOptions: Array<{
  value: AppLocale;
  label: string;
  flag: string;
}> = [
  { value: "pt", label: "Português", flag: "https://flagcdn.com/w40/br.png" },
  { value: "en", label: "English", flag: "https://flagcdn.com/w40/us.png" },
  { value: "es", label: "Español", flag: "https://flagcdn.com/w40/es.png" },
];

function resolveInitialLocale(): AppLocale {
  if (typeof window === "undefined") {
    return "pt";
  }

  const stored = window.localStorage.getItem(APP_LANGUAGE_STORAGE_KEY);
  if (stored === "pt" || stored === "en" || stored === "es") {
    return stored;
  }

  const browserLanguage = window.navigator.language.toLowerCase();
  if (browserLanguage.startsWith("en")) {
    return "en";
  }

  if (browserLanguage.startsWith("es")) {
    return "es";
  }

  return "pt";
}

const locale = ref<AppLocale>(resolveInitialLocale());

export function setAppLocale(value: AppLocale) {
  locale.value = value;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, value);
  }
}

export function useAppLanguage() {
  return {
    locale,
    localeOptions: appLanguageOptions,
    setLocale: setAppLocale,
  };
}
