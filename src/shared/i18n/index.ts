import { Device } from '@capacitor/device'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { useEffect, useState } from 'react'
import { initReactI18next } from 'react-i18next'

import { en } from './locales/en'
import { ru } from './locales/ru'

let initPromise: Promise<void> | null = null

const initI18n = () => {
  if (!initPromise) {
    initPromise = (async () => {
      const { value: lng } = await Device.getLanguageCode()

      await i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
          resources: {
            en,
            ru,
          },
          fallbackLng: 'en',
          lng,
          lowerCaseLng: true,
          supportedLngs: [ 'en', 'ru' ],
          interpolation: {
            escapeValue: false,
          },
        })
    })()
  }

  return initPromise
}

export const useInitI18n = () => {
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    void initI18n().finally(() => setLoading(false))
  }, [])

  return loading
}
