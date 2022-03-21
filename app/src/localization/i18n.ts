import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import detector from 'i18next-browser-languagedetector'

import en from './en.json'
import es from './es.json'
import LocalStorageService from '../services/localStorageService'

const resources = {
  en: { translation: en },
  es: { translation: es },
}
const fallbackLng = 'en'
const localStorageService = new LocalStorageService()
const lng = (localStorageService.get('preferred-lng') as string) || fallbackLng

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    lng,
    resources,
    fallbackLng,
    interpolation: {
      escapeValue: false,
    },
  })

i18n.languages = Object.keys(resources)

export default i18n
