/* eslint-disable react-refresh/only-export-components */
import 'primeflex/primeflex.css' // flex
import 'primeicons/primeicons.css' //icons
import 'primereact/resources/primereact.min.css' //core css
import 'primereact/resources/themes/lara-light-indigo/theme.css' //theme
import { Game, GamesEngine, Team } from '../logic/games-engine'
import { createContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M"]

// sort teams by win games and by diff of points
export const sortTeams = (a: Team, b: Team) => b.points - a.points || b.diff - a.diff

interface GamesContextType {
  games: Game[]
  round4Games: Game[]
  round5Games: Game[]
  teams: Team[]
  numberOfRounds: number
  numberOfGroups: number
  gamesPerRound: (r: number) => Game[]
  handleUpdateScore: (is: string, score: string, round?: number) => void
  handleSetTeams: (teams: string[], rounds: number, groups: number) => void
  generateRound4: () => void
  generateRound5: () => void
}

export const GamesContext = createContext({} as GamesContextType)

export const GameContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [games, setGames] = useState([] as unknown as Game[])
  const [round4Games, setRound4Games] = useState([] as unknown as Game[])
  const [round5Games, setRound5Games] = useState([] as unknown as Game[])
  const [teams, setTeams] = useState([] as unknown as Team[])
  const [numberOfRounds, setNumberOfRounds] = useState(5)
  const [numberOfGroups, setNumberOfGroups] = useState(1)

  const handleSetTeams = (teams: string[], rounds: number, groups: number) => {
    const engine = new GamesEngine(teams, groups)
    setGames(engine.games as unknown as Game[])
    setTeams(engine.teams as unknown as Team[])
    setRound4Games([])
    setRound5Games([])
    setNumberOfRounds(rounds)
    setNumberOfGroups(groups)
  }

  const handleUpdateScore = (id: string, score: string, round?: number) => {
    let winner = undefined as unknown as string
    if (score) {
      const [home, away] = score.split('-')
      winner = home > away ? 'home' : 'away'
    }

    const copyGames = round === 4 ? [...round4Games] : [...games]
    const updateGames = round === 4 ? setRound4Games : setGames

    copyGames.map(game => {
      if (game.id === id) {
        game.score = score
        game.winner = winner
      }

      return game
    })

    updateGames(copyGames)
    calculatePoints()
  }

  const calculatePoints = () => {
    // resets team points
    const copyTeams = [...teams.map(team => ({ ...team, points: 0 }))]

    games.map(game => {
      // get winner team id
      let winner = ''
      let loser = ''
      if (game.winner) {
        winner = game.winner === 'home' ? game.homeTeam.id : game.awayTeam.id
        loser = game.winner === 'home' ? game.awayTeam.id : game.homeTeam.id
      }

      // get game points diff
      let diff = 0
      if (game.score) {
        const [home, away] = game.score.split('-')
        diff = Math.abs(parseInt(home) - parseInt(away))
      }

      copyTeams.map(team => {
        if (team.id === winner) {
          team.points += 3
          team.diff += diff
        }
        else if (team.id === loser) team.diff -= diff

        return team
      })
    })

    setTeams(copyTeams)
  }

  const generateRound4 = () => {
    let copyGames = [] as unknown as Game[]

    if (numberOfGroups === 2) {
      const groupA = teams.filter(team => team.group === 'A').sort(sortTeams)
      const groupB = teams.filter(team => team.group === 'B').sort(sortTeams)

      // 1st A - 2nd B
      const a1 = groupA[0]
      const b2 = groupB[1]
      copyGames = addGame(copyGames, a1, b2, 4, 'Top')

      // 1st B - 2nd A
      const a2 = groupA[1]
      const b1 = groupB[0]
      copyGames = addGame(copyGames, a2, b1, 4, 'Top')

      // 3rd A - 4th B
      const a3 = groupA[2]
      const b4 = groupB[3]
      copyGames = addGame(copyGames, a3, b4, 4, 'Bottom')

      // 3rd B - 4th A
      const a4 = groupA[3]
      const b3 = groupB[2]
      copyGames = addGame(copyGames, a4, b3, 4, 'Bottom')
    }

    setRound4Games(copyGames)
    // setGames([...games, ...copyGames])
  }

  const generateRound5 = () => {
    let copyGames = [] as unknown as Game[]

    const getWinner = (game: Game) => game.winner === 'home' ? game.homeTeam : game.awayTeam
    const getLoser = (game: Game) => game.winner === 'home' ? game.awayTeam : game.homeTeam

    if (numberOfGroups === 2) {
      const topGroup = round4Games.filter(team => team.group === 'Top')
      const bottomGroup = round4Games.filter(team => team.group === 'Bottom')

      const winnerTop1 = getWinner(topGroup[0])
      const winnerTop2 = getWinner(topGroup[1])
      const loserTop1 = getLoser(topGroup[0])
      const loserTop2 = getLoser(topGroup[1])

      copyGames = addGame(copyGames, winnerTop1, winnerTop2, 5, 'Top')
      copyGames = addGame(copyGames, loserTop1, loserTop2, 5, 'Top')

      const winnerBottom1 = getWinner(bottomGroup[0])
      const winnerBottom2 = getWinner(bottomGroup[1])
      const loserBottom1 = getLoser(bottomGroup[0])
      const loserBottom2 = getLoser(bottomGroup[1])

      copyGames = addGame(copyGames, winnerBottom1, winnerBottom2, 5, 'Bottom')
      copyGames = addGame(copyGames, loserBottom1, loserBottom2, 5, 'Bottom')
    }

    setRound5Games(copyGames)
  }

  const addGame = (games: Game[], homeTeam: Team, awayTeam: Team, round: number, group: string) => {
    return [...games, {
      id: uuidv4(),
      score: '',
      winner: undefined,
      label: `${homeTeam.name} vs ${awayTeam.name}`,
      homeTeam,
      awayTeam,
      round,
      group
    }]
  }

  const getGamesPerRound = (round: number) => games.filter((game) => game.round === round)

  return (
    <GamesContext.Provider
      value={{
        games,
        gamesPerRound: (r: number) => getGamesPerRound(r),
        teams,
        numberOfRounds,
        numberOfGroups,
        handleSetTeams,
        handleUpdateScore,
        generateRound4,
        generateRound5,
        round4Games,
        round5Games
      }}
    >
      {children}
    </GamesContext.Provider>
  )
}
