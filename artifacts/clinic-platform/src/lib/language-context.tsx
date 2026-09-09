import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (en: string, bn: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (en) => en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Enforce strictly English across the entire platform
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    localStorage.removeItem('clinic_lang');
  }, []);

  const setLang = (_l: Language) => {
    setLangState('en');
  };

  // Strictly return English text only
  const t = (en: string, _bn?: string) => en;

  return (
    <LanguageContext.Provider value={{ lang: 'en', setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
