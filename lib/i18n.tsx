'use client';

import { createContext, useContext, ReactNode } from 'react';
import enTranslations from '@/locales/en/common.json';
import trTranslations from '@/locales/tr/common.json';

type Locale = 'en' | 'tr';

type Translations = {
  [key: string]: string;
};

const translations: Record<Locale, Translations> = {
  en: enTranslations,
  tr: trTranslations,
};

interface I18nContextType {
  locale: Locale;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  locale?: Locale;
  children: ReactNode;
}

export function I18nProvider({ locale = 'tr', children }: I18nProviderProps) {
  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = translations[locale][key] || key;

    if (!params) {
      return translation;
    }

    return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
      const placeholder = `{${paramKey}}`;
      return str.replace(placeholder, String(paramValue));
    }, translation);
  };

  return (
    <I18nContext.Provider value={{ locale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
