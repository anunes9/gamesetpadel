export type Team = {
  id: number
  name: string
}

export type Game = {
  id: number
  label: string
  awayTeam: Team
  homeTeam: Team
  round: number
  score?: string
  winner?: string
}

export interface GamesEngineType {
  teams: Team[]
  games: Game[]
  setGameResult: (position: number, score: string) => void
}

export class GamesEngine {
  teams: Team[] = []
  games: Game[] = []

  constructor(teams: Team[]) {
    if (teams.length % 2) throw new Error("Teams length must be even")

    this.teams = this.shuffle(teams)
    this.generateGames()
  }

  get getTeams(): Team[] {
    return this.teams
  }

  get getGames(): Game[] {
    return this.games
  }

  private generateGames() {
    const numberOfTeams = this.teams.length
    const homeTeams: Team[] = this.teams.slice(0, numberOfTeams / 2)
    const awayTeams: Team[] = this.teams.slice(numberOfTeams / 2, numberOfTeams)
    let id = 1

    for (let i = 0; i < numberOfTeams - 1; i++) {
      const round = i + 1

      for (let j = 0; j < homeTeams.length; j++) {
        this.games.push({
          id,
          score: '',
          winner: undefined,
          label: `${homeTeams[j].name} vs ${awayTeams[j].name}`,
          homeTeam: homeTeams[j], // teams[0]
          awayTeam: awayTeams[j], // teams[1]
          round
        })

        id++
      }

      // Rotation
      const fixedTeam = homeTeams.shift()
      homeTeams.unshift(awayTeams.shift()!)
      homeTeams.unshift(fixedTeam!)
      awayTeams.push(homeTeams.pop()!)
    }
  }

  private shuffle(array: Array<any>): Array<any> {
    let i = array.length

    while (i--) {
      const ri = Math.floor(Math.random() * (i + 1));
      [array[i], array[ri]] = [array[ri], array[i]]
    }

    return array
  }
}
