/* eslint-disable react-refresh/only-export-components */
import 'primeflex/primeflex.css' // flex
import 'primeicons/primeicons.css' //icons
import 'primereact/resources/primereact.min.css' //core css
import 'primereact/resources/themes/lara-light-indigo/theme.css' //theme
import { Game, GamesEngine, Team } from '../logic/games-engine'
import { createContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import isEqual from 'react-fast-compare'

export const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M"]

// sort teams by win games and by diff of points
export const sortTeams = (a: Team, b: Team) => b.points - a.points || b.diff - a.diff

type SavedData  = {
  games: Game[]
  round4Games: Game[]
  round5Games: Game[]
  teams: Team[]
  numberOfRounds: number
  numberOfGroups: number
}

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
  handleResetGames: () => void
}

export const GamesContext = createContext({} as GamesContextType)

const localStorageKey = 'contextState'

export const GameContextProvider = ({ children }: { children: React.ReactNode }) => {
  const savedData = window.localStorage.getItem(localStorageKey)
  const initialData: SavedData = savedData
    ? JSON.parse(savedData)
    : {
      games: [],
      teams: [],
      round4Games: [],
      round5Games: [],
      numberOfRounds: 3,
      numberOfGroups: 1,
    }
  const [games, setGames] = useState(initialData.games as unknown as Game[])
  const [round4Games, setRound4Games] = useState(initialData.round4Games as unknown as Game[])
  const [round5Games, setRound5Games] = useState(initialData.round5Games as unknown as Game[])
  const [teams, setTeams] = useState(initialData.teams as unknown as Team[])
  const [numberOfRounds, setNumberOfRounds] = useState(initialData.numberOfRounds)
  const [numberOfGroups, setNumberOfGroups] = useState(initialData.numberOfGroups)

  useEffect(() => {
    const data = JSON.stringify({
      games,
      teams,
      numberOfRounds,
      numberOfGroups,
      round4Games,
      round5Games
    })

    if (!isEqual(savedData, data)) window.localStorage.setItem(localStorageKey, data)
  }, [games, teams, numberOfRounds, numberOfGroups, round4Games, round5Games])

  const handleResetGames = () => {
    window.localStorage.removeItem(localStorageKey)
    setGames([])
    setRound4Games([])
    setRound5Games([])
    setTeams([])
    setNumberOfRounds(3)
    setNumberOfGroups(1)
  }

  const handleSetTeams = (newTeams: string[], rounds: number, groups: number) => {
    if (JSON.stringify(newTeams) !== JSON.stringify(teams)) {
      const engine = new GamesEngine(newTeams, groups)
      setGames(engine.games as unknown as Game[])
      setTeams(engine.teams as unknown as Team[])
      setRound4Games([])
      setRound5Games([])
      setNumberOfRounds(rounds)
      setNumberOfGroups(groups)
    }
  }

  const handleUpdateScore = (id: string, score: string, round?: number) => {
    let winner = undefined as unknown as string
    if (score) {
      const [home, away] = score.split('-')
      winner = home > away ? 'home' : 'away'
    }

    const copyGames = round === 4 ? [...round4Games] : round === 5 ? [...round5Games] : [...games]
    const updateGames = round === 4 ? setRound4Games : round === 5 ? setRound5Games : setGames

    copyGames.map(game => {
      if (game.id === id) {
        game.score = score
        game.winner = winner
      }

      return game
    })

    updateGames(copyGames)
    if (!round) calculatePoints()
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
    const newTeams = teams.sort(sortTeams)

    if (numberOfGroups >= 2) {
      const groupA = newTeams.slice(0, 4)
      copyGames = addGame(copyGames, groupA[0], groupA[1], 4, 'A')
      copyGames = addGame(copyGames, groupA[2], groupA[3], 4, 'A')

      const groupB = newTeams.slice(4, 8)
      copyGames = addGame(copyGames, groupB[0], groupB[1], 4, 'B')
      copyGames = addGame(copyGames, groupB[2], groupB[3], 4, 'B')
    }

    if (numberOfGroups >= 3) {
      const groupC = newTeams.slice(8, 12)
      copyGames = addGame(copyGames, groupC[0], groupC[1], 4, 'C')
      copyGames = addGame(copyGames, groupC[2], groupC[3], 4, 'C')
    }

    if (numberOfGroups === 4) {
      const groupD = newTeams.slice(12, 16)
      copyGames = addGame(copyGames, groupD[0], groupD[1], 4, 'D')
      copyGames = addGame(copyGames, groupD[2], groupD[3], 4, 'D')
    }

    setRound4Games(copyGames)
    // setGames([...games, ...copyGames])
  }

  const generateRound5 = () => {
    let copyGames = [] as unknown as Game[]

    const getWinner = (game: Game) => game.winner === 'home' ? game.homeTeam : game.awayTeam
    const getLoser = (game: Game) => game.winner === 'home' ? game.awayTeam : game.homeTeam

    const getGames = (games: Game[], group: string) => {
      const winner1 = getWinner(games[0])
      const winner2 = getWinner(games[1])
      const loser1 = getLoser(games[0])
      const loser2 = getLoser(games[1])

      copyGames = addGame(copyGames, winner1, winner2, 5, group)
      copyGames = addGame(copyGames, loser1, loser2, 5, group)
    }

    if (numberOfGroups >= 2) {
      const groupA = round4Games.filter(team => team.group === 'A')
      const groupB = round4Games.filter(team => team.group === 'B')

      getGames(groupA, 'A')
      getGames(groupB, 'B')
    }

    if (numberOfGroups >= 3) {
      const groupC = round4Games.filter(team => team.group === 'C')
      getGames(groupC, 'C')
    }

    if (numberOfGroups == 4) {
      const groupD = round4Games.filter(team => team.group === 'D')
      getGames(groupD, 'D')
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

  const gamesPerRound = (round: number) => games.filter((game) => game.round === round)

  return (
    <GamesContext.Provider
      value={{
        games,
        gamesPerRound,
        teams,
        numberOfRounds,
        numberOfGroups,
        handleResetGames,
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
