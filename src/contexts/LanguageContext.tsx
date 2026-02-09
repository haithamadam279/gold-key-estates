import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { changeLanguage, getCurrentLanguage } from '@/lib/i18n';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language') as Language;
    if (stored === 'ar' || stored === 'en') return stored;
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isRTL: language === 'ar',
      }}
    >
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
