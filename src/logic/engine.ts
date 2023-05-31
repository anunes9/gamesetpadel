import { v4 as uuidv4 } from 'uuid'

export type Team = {
  id: string
  name: string
  points: number
  diff: number
  group?: string
}

export type Game = {
  id: string,
  label: string
  awayTeam: Team
  homeTeam: Team
  round: number
  score?: string
  winner?: string
  group?: string
  court: number
}

export const letters = ["A", "B", "C", "D"]

export const GameSetPadelEngine
  = (initialTeams: string[], courts: number[]): { games: Game[], teams: Team[], error?: string } => {
    if (initialTeams.length % 2) return { games: [], teams: [], error: 'Teams length must be even' }

    const shuffleTeams = shuffle(initialTeams)

    // 4, 8, 12, 16
    let groupSize = 4

    if (initialTeams.length === 6) groupSize = 6
    else if (initialTeams.length === 10) groupSize = 5
    else if (initialTeams.length === 14) groupSize = 7

    return generateTeamsAndGames(shuffleTeams, courts, groupSize)
  }

const generateTeamsAndGames = (shuffleTeams: string[], courts: any, step: number) => {
  let teams: Team[] = []
  let games: Game[] = []
  let letterIndex = 0
  let courtsIndex = 0


  for (let index = 0; index < shuffleTeams.length; index += step) {
    const endIndex = index + step
    const groupLetter = letters[letterIndex]

    const group = shuffleTeams.slice(index, endIndex).map((t: string) => createTeam(t, groupLetter))
    const groupGames = generateGames(group, groupLetter, courts.slice(courtsIndex, courtsIndex + 2))

    teams = teams.concat(group)
    games = games.concat(groupGames)

    letterIndex++
    courtsIndex += 2
  }

  return { teams, games }
}

const createTeam = (name: string, group: string): Team => ({
  id: uuidv4(),
  name,
  points: 0,
  group,
  diff: 0
})

const generateGames = (teams: Team[], group: string, courts: number[]): Game[] => {
  const games = []
  const numberOfTeams = teams.length
  const homeTeams: Team[] = teams.slice(0, numberOfTeams / 2)
  const awayTeams: Team[] = teams.slice(numberOfTeams / 2, numberOfTeams)
  let courtIndex = 0

  for (let i = 0; i < numberOfTeams - 1; i++) {
    const round = i + 1
    courtIndex = 0

    for (let j = 0; j < homeTeams.length; j++) {
      games.push({
        id: uuidv4(),
        score: '',
        winner: undefined,
        label: `${homeTeams[j].name} vs ${awayTeams[j].name}`,
        homeTeam: homeTeams[j],
        awayTeam: awayTeams[j],
        round,
        group,
        court: courts[courtIndex]
      })

      courtIndex++
    }

    // teams rotation
    const fixedTeam = homeTeams.shift()
    homeTeams.unshift(awayTeams.shift()!)
    homeTeams.unshift(fixedTeam!)
    awayTeams.push(homeTeams.pop()!)
  }

  return games
}

export const generateRound4Games = (teams: Team[], numberOfGroups: number): Game[] => {
  let games = [] as unknown as Game[]
  const sortedTeams = teams.sort(sortTeams)

  if (numberOfGroups >= 2) {
    const groupA = sortedTeams.slice(0, 4)
    games = addGame(games, groupA[0], groupA[1], 4, 'A')
    games = addGame(games, groupA[2], groupA[3], 4, 'A')

    const groupB = sortedTeams.slice(4, 8)
    games = addGame(games, groupB[0], groupB[1], 4, 'B')
    games = addGame(games, groupB[2], groupB[3], 4, 'B')
  }

  if (numberOfGroups >= 3) {
    const groupC = sortedTeams.slice(8, 12)
    games = addGame(games, groupC[0], groupC[1], 4, 'C')
    games = addGame(games, groupC[2], groupC[3], 4, 'C')
  }

  if (numberOfGroups === 4) {
    const groupD = sortedTeams.slice(12, 16)
    games = addGame(games, groupD[0], groupD[1], 4, 'D')
    games = addGame(games, groupD[2], groupD[3], 4, 'D')
  }

  return games
}

export const generateRound5Games = (round4Games: Game[], numberOfGroups: number) => {
  const games = [] as unknown as Game[]

  const getGames = (games: Game[], group: string) => {
    const winner1 = getWinner(games[0])
    const winner2 = getWinner(games[1])
    const loser1 = getLoser(games[0])
    const loser2 = getLoser(games[1])

    games = addGame(games, winner1, winner2, 5, group)
    games = addGame(games, loser1, loser2, 5, group)
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

  return games
}

export const calculateTeamPoints = (teams: Team[], games: Game[]) => {
  // resets team points
  const newTeams = [...teams.map(team => ({ ...team, points: 0, diff: 0 }))]
  let winner = null as unknown as Team
  let loser = null as unknown as Team

  games.map(g => {
    // get winner team object
    if (g.winner) {
      winner = getWinner(g)
      loser = getLoser(g)

      // get game points diff
      let diff = 0
      if (g.score) {
        const [home, away] = g.score.split('-')
        diff = Math.abs(parseInt(home) - parseInt(away))
      }

      newTeams.find(t => t.id === winner.id)!.points += 3
      newTeams.find(t => t.id === winner.id)!.diff += diff
      newTeams.find(t => t.id === loser.id)!.diff -= diff
    }
  })

  return newTeams
}

const addGame = (games: Game[], homeTeam: Team, awayTeam: Team, round: number, group: string) => games.concat({
  id: uuidv4(),
  score: '',
  winner: undefined,
  label: `${homeTeam.name} vs ${awayTeam.name}`,
  homeTeam,
  awayTeam,
  round,
  group,
  court: 0
})

// sort teams by win games and by diff of points
export const sortTeams = (a: Team, b: Team) => b.points - a.points || b.diff - a.diff

const getWinner = (game: Game) => game.winner === 'home' ? game.homeTeam : game.awayTeam

const getLoser = (game: Game) => game.winner === 'home' ? game.awayTeam : game.homeTeam

const shuffle = (array: string[]): string[] => {
  let i = array.length

  while (i--) {
    const ri = Math.floor(Math.random() * (i + 1));
    [array[i], array[ri]] = [array[ri], array[i]]
  }

  return array
}