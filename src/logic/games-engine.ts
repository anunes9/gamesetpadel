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
}

export interface GamesEngineType {
  teams: Team[]
  games: Game[]
  numberOfGroups: number
}

export class GamesEngine {
  teams: Team[] = []
  games: Game[] = []

  constructor(teams: string[], groups: number) {
    if (teams.length % 2) throw new Error("Teams length must be even")

    if (groups === 1) {
      const groupA = teams.slice(0, 4).map((t) => this.createTeam(t, 'A'))
      this.generateGames(this.shuffle(groupA), 'A')

      this.teams = groupA
    }
    else if (groups >= 2) {
      const groupA = teams.slice(0, 4).map((t) => this.createTeam(t, 'A'))
      this.generateGames(this.shuffle(groupA), 'A')

      const groupB = teams.slice(4, 8).map((t) => this.createTeam(t, 'B'))
      this.generateGames(this.shuffle(groupB), 'B')

      this.teams = [...groupA, ...groupB]
    }
    else if (groups >= 3) {
      const groupA = teams.slice(0, 4).map((t) => this.createTeam(t, 'A'))
      this.generateGames(this.shuffle(groupA), 'A')

      const groupB = teams.slice(4, 8).map((t) => this.createTeam(t, 'B'))
      this.generateGames(this.shuffle(groupB), 'B')

      const groupC = teams.slice(8, 12).map((t) => this.createTeam(t, 'C'))
      this.generateGames(this.shuffle(groupC), 'C')

      this.teams = [...groupA, ...groupB, ...groupC]
    }
    else if (groups === 4) {
      const groupA = teams.slice(0, 4).map((t) => this.createTeam(t, 'A'))
      this.generateGames(this.shuffle(groupA), 'A')

      const groupB = teams.slice(4, 8).map((t) => this.createTeam(t, 'B'))
      this.generateGames(this.shuffle(groupB), 'B')

      const groupC = teams.slice(8, 12).map((t) => this.createTeam(t, 'C'))
      this.generateGames(this.shuffle(groupC), 'C')

      const groupD = teams.slice(12, 16).map((t) => this.createTeam(t, 'D'))
      this.generateGames(this.shuffle(groupD), 'D')

      this.teams = [...groupA, ...groupB, ...groupC, ...groupD]
    }
  }

  private createTeam(name: string, group: string) {
    return { id: uuidv4(), name, points: 0, group, diff: 0 }
  }

  private generateGames(teams: Team[], group: string) {
    const numberOfTeams = 4
    const homeTeams: Team[] = teams.slice(0, numberOfTeams / 2)
    const awayTeams: Team[] = teams.slice(numberOfTeams / 2, numberOfTeams)

    for (let i = 0; i < numberOfTeams - 1; i++) {
      const round = i + 1

      for (let j = 0; j < homeTeams.length; j++) {
        this.games.push({
          id: uuidv4(),
          score: '',
          winner: undefined,
          label: `${homeTeams[j].name} vs ${awayTeams[j].name}`,
          homeTeam: homeTeams[j], // teams[0]
          awayTeam: awayTeams[j], // teams[1]
          round,
          group
        })
      }

      // teams rotation
      const fixedTeam = homeTeams.shift()
      homeTeams.unshift(awayTeams.shift()!)
      homeTeams.unshift(fixedTeam!)
      awayTeams.push(homeTeams.pop()!)
    }
  }

  private shuffle(array: Team[]): Team[] {
    let i = array.length

    while (i--) {
      const ri = Math.floor(Math.random() * (i + 1));
      [array[i], array[ri]] = [array[ri], array[i]]
    }

    return array
  }
}
