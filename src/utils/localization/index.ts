import { en } from './en';
import { ar } from './ar';
import { Language } from '../../types';

export type TranslationKeys = typeof en;

const translations: Record<Language, TranslationKeys> = {
  en,
  ar,
};

export default translations;

// Helper function to get translation
export const getTranslation = (language: Language): TranslationKeys => {
  return translations[language] || translations.en;
};

// Type-safe translation function
export const t = (language: Language) => {
  const translation = getTranslation(language);
  
  return (key: string): string => {
    const keys = key.split('.');
    let value: any = translation;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
};