import "primeflex/primeflex.css" // flex
import "primeicons/primeicons.css" //icons
import "primereact/resources/primereact.min.css" //core css
import "primereact/resources/themes/lara-light-indigo/theme.css" //theme
import { GamesComponent } from "./components/Games"
import { TeamsComponent } from "./components/Teams"
import { ResultsComponent } from "./components/Results"
import { TabView, TabPanel } from 'primereact/tabview'

const App = () => {
  return (
    <>
      <p className="text-4xl font-bold mt-0 text-center text-color">Padel Games</p>

      <TabView>
        <TabPanel header="Teams" leftIcon="pi pi-user mr-2">
          <TeamsComponent />
        </TabPanel>

        <TabPanel header="Games" leftIcon="pi pi-calendar ml-2">
          <GamesComponent />
        </TabPanel>

        <TabPanel header="Results" leftIcon="pi pi-search mr-2">
          <ResultsComponent />
        </TabPanel>
      </TabView>

      {/* <TeamsComponent />
      <ResultsComponent />
      <GamesComponent /> */}
    </>
  )
}

export default App
