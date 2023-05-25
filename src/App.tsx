import "primeflex/primeflex.css" // flex
import "primeicons/primeicons.css" //icons
import "primereact/resources/primereact.min.css" //core css
import "primereact/resources/themes/lara-light-indigo/theme.css" //theme
import { GamesComponent } from "./components/Games"
import { TeamsComponent } from "./components/Teams"
import { ResultsComponent } from "./components/Results"
import { TabView, TabPanel } from 'primereact/tabview'
import { Toast } from 'primereact/toast'
import { useRef, useState } from "react"
import { Footer } from "./template/Footer"
import { Header } from "./template/Header"
import { useTranslation } from "react-i18next"

const App = () => {
  const { t } = useTranslation()
  const toast = useRef<Toast>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <>
      <Header />

      <section>
        <div className="body-content">
          <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
            <TabPanel header={t('teams.teams')} leftIcon="pi pi-user mr-2">
              <TeamsComponent
                handleSuccess={(detail: string) => {
                  toast.current?.show({ severity: 'success', summary: 'Success', detail})
                  setActiveIndex(1)
                }}
              />
            </TabPanel>

            <TabPanel header={t('games.games')} leftIcon="pi pi-calendar mr-2">
              <GamesComponent
                showToast={(detail: string) => {
                  toast.current?.show({ severity: 'success', summary: 'Success', detail})
                }}
              />
            </TabPanel>

            <TabPanel header={t('games.results')} leftIcon="pi pi-search mr-2">
              <ResultsComponent />
            </TabPanel>
          </TabView>

          <Toast ref={toast} position="bottom-right" />
        </div>
      </section>

      <Footer />
    </>
  )
}

export default App
