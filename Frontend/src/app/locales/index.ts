/**
 * Localization index
 * Central access point for all translations
 */

import { he } from './he';

// Current locale (can be extended for multi-language support)
export const currentLocale = 'he';

// Export translations
export const translations = {
  he,
};

// Simple translation function
export const t = translations[currentLocale];

// Hook for using translations in components
export const useTranslations = () => {
  return t;
};

export default t;
