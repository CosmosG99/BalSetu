import React, { createContext, useContext, useState } from 'react';
import { Language } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { mr } from '../locales/mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const dictionaries: Record<Language, Record<string, string>> = {
  en: en as Record<string, string>,
  hi: hi as Record<string, string>,
  mr: mr as Record<string, string>
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('rakshak_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rakshak_lang', lang);
  };

  const t = (key: string): string => {
    return dictionaries[language]?.[key] || dictionaries['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
