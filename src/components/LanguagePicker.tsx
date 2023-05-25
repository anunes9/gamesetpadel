import { useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { useTranslation } from 'react-i18next'
import './LanguagePicker.css'

const countries = {
  pt: { flag: './pt_flag.png' },
  en: { flag: './en_flag.png' }
}

export const LanguagePicker = () => {
  const { i18n } = useTranslation()
  const [selectedCountry, setSelectedCountry] = useState(window.localStorage.getItem('lang') || 'en')
  const availableLanguages = ['pt','en']

  const countryOptionTemplate = (option: 'pt'|'en') => (
    <div className="flex align-items-center">
      <img alt={option} src={countries[option].flag} className="mr-2" />
      <div>{option.toUpperCase()}</div>
    </div>
  )

  return (
    <Dropdown
      id="language"
      value={selectedCountry}
      onChange={(e) => {
        setSelectedCountry(e.value)
        i18n.changeLanguage(e.value || 'en')
        window.localStorage.setItem('lang', e.value)
      }}
      options={availableLanguages}
      optionLabel="code"
      valueTemplate={countryOptionTemplate}
      itemTemplate={countryOptionTemplate}
      className="w-5rem p-inputtext-sm h-2rem"
      placeholder="Display language"
    />
  )
}
