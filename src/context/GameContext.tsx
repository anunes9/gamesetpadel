/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'
import {
  Game,
  GameSetPadelEngine,
  Team,
  calculateTeamPoints,
  generateRound4Games,
  generateRound5Games
} from '../logic/engine'

type SavedData  = {
  numberOfGroups: number
  numberOfRounds: number
  round1Games: Game[]
  round2Games: Game[]
  round3Games: Game[]
  round4Games: Game[]
  round5Games: Game[]
  teams: Team[]
}

interface GamesContextType {
  numberOfGroups: number
  numberOfRounds: number
  round1Games: Game[]
  round2Games: Game[]
  round3Games: Game[]
  round4Games: Game[]
  round5Games: Game[]
  teams: Team[]
  // functions
  handleUpdateScore: (is: string, score: string, round: number) => void
  handleSetTeams: (teams: string[], rounds: number, groups: number, courts: number[]) => void
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
      teams: [],
      round1Games: [],
      round2Games: [],
      round3Games: [],
      round4Games: [],
      round5Games: [],
      numberOfRounds: 3,
      numberOfGroups: 1,
    }
  const [round1Games, setRound1Games] = useState(initialData.round1Games as unknown as Game[])
  const [round2Games, setRound2Games] = useState(initialData.round2Games as unknown as Game[])
  const [round3Games, setRound3Games] = useState(initialData.round3Games as unknown as Game[])
  const [round4Games, setRound4Games] = useState(initialData.round4Games as unknown as Game[])
  const [round5Games, setRound5Games] = useState(initialData.round5Games as unknown as Game[])
  const [teams, setTeams] = useState(initialData.teams as unknown as Team[])
  const [numberOfRounds, setNumberOfRounds] = useState(initialData.numberOfRounds)
  const [numberOfGroups, setNumberOfGroups] = useState(initialData.numberOfGroups)

  useEffect(() => {
    const data = JSON.stringify({
      numberOfGroups,
      numberOfRounds,
      round1Games,
      round2Games,
      round3Games,
      round4Games,
      round5Games,
      teams
    })

    if (!isEqual(savedData, data)) window.localStorage.setItem(localStorageKey, data)
  }, [
    numberOfGroups,
    numberOfRounds,
    round1Games,
    round2Games,
    round3Games,
    round4Games,
    round5Games,
    teams
  ])

  const handleResetGames = () => {
    window.localStorage.removeItem(localStorageKey)
    setNumberOfGroups(1)
    setNumberOfRounds(3)
    setRound1Games([])
    setRound2Games([])
    setRound3Games([])
    setRound4Games([])
    setRound5Games([])
    setTeams([])
  }

  const handleSetTeams = (newTeams: string[], rounds: number, groups: number, courts: number[]) => {
    if (JSON.stringify(newTeams) !== JSON.stringify(teams)) {
      const engine = GameSetPadelEngine(newTeams, courts)

      setNumberOfGroups(groups)
      setNumberOfRounds(rounds)

      setRound1Games(engine.games.filter(g => g.round === 1))
      setRound2Games(engine.games.filter(g => g.round === 2))
      setRound3Games(engine.games.filter(g => g.round === 3))
      // if teams === 6 when get the games for round 4 and 5
      setRound4Games(newTeams.length === 6 ? engine.games.filter(g => g.round === 4) : [])
      setRound5Games(newTeams.length === 6 ? engine.games.filter(g => g.round === 5) : [])

      setTeams(engine.teams as unknown as Team[])
    }
  }

  const handleUpdateScore = (gameId: string, score: string, round: number) => {
    let copyGames = undefined
    let updateGames = undefined
    let winner = undefined as unknown as string

    if (score) {
      const [home, away] = score.split('-')
      winner = home > away ? 'home' : 'away'

      switch (round) {
        case 2:
          copyGames = [...round2Games]
          updateGames = setRound2Games
          break
        case 3:
          copyGames = [...round3Games]
          updateGames = setRound3Games
          break
        case 4:
          copyGames = [...round4Games]
          updateGames = setRound4Games
          break
        case 5:
          copyGames = [...round5Games]
          updateGames = setRound5Games
          break
          // round 1
        default:
          copyGames = [...round1Games]
          updateGames = setRound1Games
      }

      copyGames.find(g => g.id === gameId)!.score = score
      copyGames.find(g => g.id === gameId)!.winner = winner

      updateGames(copyGames)
      if (teams.length === 6 || round < 4) calculatePoints()
    }
  }

  const calculatePoints = () => {
    const games = teams.length === 6
      ? [...round1Games, ...round2Games, ...round3Games, ...round4Games, ...round5Games]
      : [...round1Games, ...round2Games, ...round3Games]

    setTeams(calculateTeamPoints(teams, games))
  }

  return (
    <GamesContext.Provider
      value={{
        numberOfGroups,
        numberOfRounds,
        round1Games,
        round2Games,
        round3Games,
        round4Games,
        round5Games,
        teams,

        handleResetGames,
        handleSetTeams,
        handleUpdateScore,
        generateRound4: () => generateRound4Games(teams, numberOfGroups),
        generateRound5: () => generateRound5Games(round4Games, numberOfGroups),
      }}
    >
      {children}
    </GamesContext.Provider>
  )
}
