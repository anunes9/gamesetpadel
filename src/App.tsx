import "primeflex/primeflex.css" // flex
import "primeicons/primeicons.css" //icons
import "primereact/resources/primereact.min.css" //core css
import "primereact/resources/themes/lara-light-indigo/theme.css" //theme
import { GamesComponent } from "./components/Games"
import { GameContextProvider } from "./context/GameContext"
import { TeamsComponent } from "./components/Teams"



const App = () => (
  <>
    <GameContextProvider>
      <h1 className="mt-0 ">Padel Games</h1>

      <TeamsComponent />

      <GamesComponent />
    </GameContextProvider>
  </>
)

export default App
