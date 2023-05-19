import 'primeflex/primeflex.css' // flex
import 'primeicons/primeicons.css' //icons
import 'primereact/resources/primereact.min.css' //core css
import 'primereact/resources/themes/lara-light-indigo/theme.css' //theme
import { Game, GamesEngine, Team } from '../logic/games-engine'
import { createContext, useState } from 'react'

interface GamesContextType {
  games: Game[]
  teams: Team[]
  numberOfRounds: number

  gamesPerRound: (r: number) => Game[]
  handleUpdateScore: (index: number, score: string) => void
  handleSetTeams: (teams: string[]) => void
}

export const GamesContext = createContext({} as GamesContextType)

export const GameContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [games, setGames] = useState([] as unknown as Game[])
  const [teams, setTeams] = useState([] as unknown as Team[])

  const handleSetTeams = (teams: string[]) => {
    const gameTeams = teams.map((t, index) => ({ id: index + 1, name: t }))
    const engine = new GamesEngine(gameTeams)
    setGames(engine.games as unknown as Game[])
    setTeams(engine.teams as unknown as Team[])
  }

  const handleUpdateScore = (index: number, score: string) => {
    let winner = undefined
    if (score) {
      const [home, away] = score.split('-')
      winner = home > away ? 'home' : 'away'
    }

    const copyGames = [...games]

    copyGames[index].score = score
    copyGames[index].winner = winner

    setGames(copyGames)
  }

  return (
    <GamesContext.Provider
      value={{
        games,
        gamesPerRound: (r: number) => games.filter((game) => game.round === r),
        teams,
        numberOfRounds: teams.length -1,
        handleSetTeams,
        handleUpdateScore,
      }}
    >
      {children}
    </GamesContext.Provider>
  )
}
