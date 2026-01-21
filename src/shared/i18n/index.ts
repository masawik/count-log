import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { en } from './locales/en'
import { ru } from './locales/ru'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      ru,
    },
    fallbackLng: 'en',
    lowerCaseLng: true,
    supportedLngs: [ 'en', 'ru' ],
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
