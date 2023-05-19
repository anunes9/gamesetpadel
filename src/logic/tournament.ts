type ListTeams = ReadonlyArray<Team>
type ListRounds = Array<any>
type Matches = Game[][]

type Game = {
  home: Team,
  away: Team,
  label: string
  score: string
  winner?: string
  round: number
}

type Team = {
  id: number
  name: string
}

interface TournamentInterface {
  readonly teams: ListTeams
}

/**
 * Class to create a all-play-all tournament
 * matches considering home and away rounds
 */
export default class Tournament implements TournamentInterface {
  readonly teams: ListTeams

  constructor(teams: ListTeams) {
    if (teams.length % 2) throw new Error("Teams length must be even")

    this.teams = this.shuffle(teams)
  }

  get matches(): Game[] {
    return this.tournament().flat()
  }

  /**
   * Create two rounds ensuring the home/away inversion.
   *
   * @return {Array} A complete list of rounds with matches.
   */
  tournament(): Game[] {
    return this.calculateMatches()
  }

  /**
   * Based on each round, distribute teams to play
   * home or away without repetition
   *
   * @returns {Array} All rounds of the first half of the tournament
   */
  protected calculateMatches(): Game[] {
    return this.rounds([[...this.teams]]).map((round: ListRounds, index) => {

      const r = [...round]
      const games: Game[] = []

      while (r.length > 0) {
        games.push(
          {
            home: r[0],
            away: r[1],
            label: `${r[0].name} vs ${r[1].name} `,
            score: '',
            winner: undefined,
            round: index + 1
          }
        )
        r.splice(0, 2)
      }

      return games
    }).flat()
  }

  /**
   * Based on teams, rotate them to create rounds
   *
   * @param {Array} round - List of teams to play in this round
   * @returns {Array} With Home and Away Team
   */
  protected rounds(teams: ListRounds): ListRounds {
    if (teams.length !== teams[0].length - 1) {
      teams.push(this.lockedRotate(teams[teams.length - 1]))
      teams = this.rounds(teams)
    }

    return teams
  }

  protected rotate(list: Array<any> = []): Array<any> {
    return list.slice(1, list.length).concat(list.slice(0, 1))
  }

  protected lockedRotate(list: Array<any> = [], lockedPosition = 1): Array<any> {
    list = [...list]
    return [...list.splice(0, lockedPosition), ...this.rotate(list)]
  }

  protected shuffle(array: any): Array<any> {
    let i = array.length;

    while (i--) {
      const ri = Math.floor(Math.random() * (i + 1));
      [array[i], array[ri]] = [array[ri], array[i]];
    }

    return array;
  }
}
