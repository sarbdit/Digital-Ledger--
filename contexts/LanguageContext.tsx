
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from '../locales/en';
import { bn } from '../locales/bn';

type Language = 'en' | 'bn';

const translations = { en, bn };

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('tallyKhataLanguage') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('tallyKhataLanguage', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, replacements?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let text: any = translations[language];
    let fallbackText: any = translations.en;

    try {
        for (const k of keys) {
            text = text[k];
            fallbackText = fallbackText[k];
        }
    } catch(e) {
        console.warn(`Translation key "${key}" traversal failed.`);
        return key;
    }
    
    // If text not found in current lang, use fallback
    if(typeof text === 'undefined' || text === null) {
        text = fallbackText;
    }

    if (typeof text !== 'string') {
        console.warn(`Translation for key "${key}" is not a string.`);
        return key;
    }

    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g');
        text = (text as string).replace(regex, String(replacements[placeholder]));
      });
    }

    return text;
  };


  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
