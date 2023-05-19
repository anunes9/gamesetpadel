type Team = {
  id: number
  name: string
}

type Game = {
  label: string
  awayTeam: Team
  homeTeam: Team
  round: number
  score?: string
  winner?: string
}

export const SingleRoundGenerator = (teams: Team[]): Game[] => {
  if (teams.length % 2) return []

  const games: Game[] = []
  const teamList = shuffle(teams)
  const numberOfTeams = teamList.length
  const homeTeams: Team[] = teamList.slice(0, numberOfTeams / 2)
  const awayTeams: Team[] = teamList.slice(numberOfTeams / 2, numberOfTeams)

  for (let i = 0; i < numberOfTeams - 1; i++) {
    // Sets round
    const round = i + 1

    for (let j = 0; j < homeTeams.length; j++) {
      // const teams = shuffle([homeTeams[j], awayTeams[j]])

      games.push({
        score: '',
        winner: undefined,
        label: `${homeTeams[j].name} vs ${awayTeams[j].name}`,
        homeTeam: homeTeams[j], // teams[0]
        awayTeam: awayTeams[j], // teams[1]
        round
      })
    }

    // Rotation
    const fixedTeam = homeTeams.shift()
    homeTeams.unshift(awayTeams.shift()!)
    homeTeams.unshift(fixedTeam!)
    awayTeams.push(homeTeams.pop()!)
  }

  // const fixtures = games.concat(secondRound);

  return games
}

const shuffle = <T>(array: T[]): T[] => {
  let i = array.length

  while (i--) {
    const ri = Math.floor(Math.random() * (i + 1));
    [array[i], array[ri]] = [array[ri], array[i]]
  }

  return array
}