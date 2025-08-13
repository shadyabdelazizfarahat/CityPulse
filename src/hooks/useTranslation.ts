import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { t, getTranslation } from '../utils/localization';

interface UseTranslationReturn {
  t: (key: string) => string;
  language: string;
  isRTL: boolean;
  translations: any;
}

export const useTranslation = (): UseTranslationReturn => {
  const { language, isRTL } = useApp();

  const translationFunction = useMemo(() => {
    return t(language);
  }, [language]);

  const translations = useMemo(() => {
    return getTranslation(language);
  }, [language]);

  return {
    t: translationFunction,
    language,
    isRTL,
    translations,
  };
};

export default useTranslation;