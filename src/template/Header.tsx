import { useTranslation } from "react-i18next"

export const Header = () => {
  const { t } = useTranslation()

  return (
    <header>
      <div className="flex justify-content-center align-items-center content h-full">
        <p className="font-bold m-0 text-5xl text-teal-700">{t('generic.app-title')}</p>
      </div>
    </header>
  )
}
