import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import detector from 'i18next-browser-languagedetector'
import en from './en.json'
import es from './es.json'

const resources = {
  en: { translation: en },
  es: { translation: es },
}

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

i18n.languages = Object.keys(resources)

export default i18n
