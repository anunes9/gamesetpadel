import { useTranslation } from "react-i18next"
import { LanguagePicker } from "../components/LanguagePicker"

export const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer>
      <div className="flex justify-content-between align-items-center py-1 content">
        <div>
          <img src="/logo-black.svg" alt="logo" width="40" />
          <p className="m-0 text-xs text-500">{t('footer.text')}</p>
        </div>

        <div className="flex justify-content-between align-items-center gap-3">
          <a href="https://anunes9.github.io/me/">
            <i className="pi pi-github" style={{ color: 'var(--gray-500)' }} />
          </a>

          <LanguagePicker />
        </div>
      </div>

    </footer>
  )
}
