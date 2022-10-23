import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import detector from "i18next-browser-languagedetector"

import en from "./en.json"
import es from "./es.json"
import LocalStorage from "../utils/LocalStorage"

const resources = {
  en: {translation: en},
  es: {translation: es},
}
const fallbackLng = "en"
const languageStorage = new LocalStorage("preferred-lng")
const localLanguage = languageStorage.get<string>()
const lng =
  typeof localLanguage === "string" && ["en", "es"].includes(localLanguage)
    ? localLanguage
    : fallbackLng

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
