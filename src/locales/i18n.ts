import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import pt from './pt.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: en
      },
      pt: {
        translation: pt
      }
    }
  })

export default i18n
