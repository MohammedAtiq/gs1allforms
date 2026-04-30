"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

type LanguageCode = "en" | "ar";

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("app-language");
    const initialLanguage: LanguageCode =
      stored === "en" || stored === "ar" ? stored : "en";
 
    setLanguageState(initialLanguage);
    i18n.changeLanguage(initialLanguage);
    document.documentElement.lang = initialLanguage;
    document.documentElement.dir = initialLanguage === "ar" ? "rtl" : "ltr";
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("app-language", language);
  }, [language, isReady]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: (lang: LanguageCode) => setLanguageState(lang),
      isRTL: language === "ar",
    }),
    [language],
  );

  if (!isReady) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
    </I18nextProvider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}

