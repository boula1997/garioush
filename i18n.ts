import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en/translation.json';
import ar from './locales/ar/translation.json';

const deviceLocale = Localization.locale ?? 'en'; // fallback to 'en' if undefined

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: deviceLocale.startsWith('ar') ? 'ar' : 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
